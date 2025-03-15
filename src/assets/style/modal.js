import { Dimensions } from 'react-native'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default {
  container: {
    width: windowWidth,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.3)',
    position: 'absolute',
    paddingHorizontal: 25
  },

  setupConnection: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    top: 250,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    display: 'flex',
    gap: 5
  },

  setupConnectionTitle: {
    color: 'rgba(0,0,0,.4)',
    paddingLeft: 3
  },

  setupConnectionInput: {
    borderColor: 'rgba(255, 151, 30, .3)',
    borderWidth: 1,
    height: 40,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 15
  },

  setupBtnContainer: {
    width: '100%',
    display: 'flex',
    gap: 5,
    flexDirection: 'row'
  },

  setupBtnWrapper: {
    width: '50%',
    height: 40,
    borderRadius: 40,
    padding: 2,
    marginTop: 15
  },

  setupBtn: {
    height: '100%',
    width: '100%',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  setupBtnText: {
    fontSize: 15,
    color: '#fff',
    opacity: .7
  }
}