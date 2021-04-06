import EventService from '@/services/EventService.js';


export const state = {
    events: [],
    maxPage: null,
    event: {}
  }

export const  mutations = {
    ADD_EVENT(state,event){
      state.events.push(event)
    },
    SET_EVENTS(state, events){
      state.events = events;
    },
    SET_MAX_PAGE(state, count){
      state.maxPage = Math.ceil(count/3)
    },
    SET_EVENT(state, event) {
      state.event = event
    }
  }

export const actions =  {
    createEvent({ commit }, event) {
      return EventService.postEvent(event) .then(() => {
        commit ('ADD_EVENT', event) 
      })
    },
    fetchEvents({commit}, { perPage, page }) {
      EventService.getEvents(perPage, page)
      .then((response) => {
        const count = response.headers['x-total-count'];
        commit ('SET_MAX_PAGE', count);
        commit ('SET_EVENTS', response.data);
        })
      .catch(error => {
        alert(`oh no server request failed! Check the console for details!`)
        console.log('error getting events: ', error)
      })
    },
    fetchSingleEvent({ commit, getters }, id) {
        const event = getters.getEventById(id)
        if (event) {
          commit ('SET_EVENT', event)
        } else {
          EventService.getEvent( id )
          .then((response) => {
              commit('SET_EVENT', response.data );
          })
          .catch(error => {
              alert(`oh no server request failed! Check the console for details!`)
              console.log('error getting events: ', error)
          })
        }
    } 
  }

export const getters =  { 
    getEventById: state => id => {
      for (let item of state.events){
        if (item.id == id) {
          return item
        }
      }
      return undefined
    }
  }
