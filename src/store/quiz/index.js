import db from '@/db'
import firebase from '@/firebase'

import {
  UPDATE_INFORMATION,
  ADD_ANSWER,
  REMOVE_QUESTION,
  REMOVE_ANSWER,
  UPDATE_ANSWER,
  RESET_QUIZ,
  UPDATE_QUESTION,
  ADD_QUESTION,
  RESET_QUIZ_LIST,
  PUSH_QUIZ
} from './mutations'

const state = {
  newQuiz: {
    title: 'Quiz 2018',
    description: 100,
    questions: [
      {
        question: 'First question',
        points: 'First points',
        answers: [
          {
            answer: 'First answer'
          }
        ]
      }
    ]
  },
  list: []
}

const getters = {
  newQuiz: ({newQuiz}) => newQuiz,
  list: ({list}) => list
}

const mutations = {
  [PUSH_QUIZ] (state, quiz) {
    state.list.push(quiz)
  },

  [RESET_QUIZ_LIST] (state) {
    state.list = []
  },

  [RESET_QUIZ] (state) {
    this.newQuiz = {
      title: '',
      description: '',
      questions: []
    }
  },
  [UPDATE_INFORMATION] (state, info) {
    state.newQuiz.title = info.title
    state.newQuiz.description = info.description
  },

  [ADD_ANSWER] (state, questionIndex) {
    const answers = state.newQuiz.questions[questionIndex].answers
    if (answers.length < 5) {
      answers.push({
        answer: 'Anotha one!',
        isRight: false
      })
    }
  },

  [REMOVE_QUESTION] (state, questionIndex) {
    if (state.newQuiz.questions.length > 1) {
      state.newQuiz
        .questions
        .splice(questionIndex, 1)
    }
  },

  [REMOVE_ANSWER] (state, payload) {
    const questionIndex = payload.questionIndex
    const answerIndex = payload.answerIndex

    const question = state.newQuiz.questions[questionIndex]

    if (question.answers.length > 1) {
      question.answers.splice(answerIndex, 1)
    }
  },

  [UPDATE_ANSWER] (state, payload) {
    const questionIndex = payload.questionIndex
    const answerIndex = payload.answerIndex
    const answerText = payload.answer
    const isRight = payload.isRight

    const answer = state.newQuiz
      .questions[questionIndex]
      .answers[answerIndex]

    answer.isRight = isRight
    answer.answer = answerText
  },

  [UPDATE_QUESTION] (state, payload) {
    const question = state.newQuiz.questions[payload.questionIndex]
    question.question = payload.question
    question.points = payload.points
  },

  [ADD_QUESTION] (state) {
    state.newQuiz
      .questions
      .push({
        question: 'Question',
        points: 0,
        answers: []
      })
  }
}

const actions = {
  async create ({state}) {
    const user = firebase.auth().currentUser
    if (user) {
      // check if there is a question without a right answer
      state.newQuiz.questions.map(question => {
        let hasRightAnswer = false

        question.answers.map(answer => {
          if (answer.isRight) hasRightAnswer = true
        })

        if (!hasRightAnswer) {
          alert(`Question: '${question.question}' doesn't have a right answer!`)
          throw new Error()
        }
      })

      // save to database
      await db.collection('quizes').add({
        ...state.newQuiz,
        userId: user.uid
      })

      alert('Quiz created')
    } else {
      alert('Unauthorized')
    }
  },

  list ({commit}) {
    commit(RESET_QUIZ_LIST)

    db.collection('quizes').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === 'added') {
          commit(PUSH_QUIZ, {
            id: change.doc.id,
            ...change.doc.data()
          })
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
