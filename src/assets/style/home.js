import { Dimensions } from 'react-native'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },

  contentBG: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 300,
    height: 450,
    opacity: .03
  },

  hero: {
    display: 'flex',
    height: 160,
    flexDirection: 'row-reverse',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 200,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f49531',
    overflow: 'hidden'
  },

  heroIcon: {
    position: 'absolute',
    right: -10,
    bottom: -18,
    fontSize: 150,
    color: 'rgba(0,0,0,.02)'
  },

  heroImage: {
    width: 180,
    height: 180,
    position: 'absolute',
    top: 50,
    right: 20
  },

  header: {
    width: windowWidth - 40,
    display: 'flex',
    marginTop: 190,
    gap: 10
  },

  greetings: {
    color: '#11335a',
    fontSize: 18
  },

  headText: {
    color: 'rgba(0,0,0,.5)',
    fontSize: 13,
    width: windowWidth - 40
  },

  headTextItem: {
    color: '#f49531'
  },

  setupPanel: {
    width: windowWidth - 40,
    paddingVertical: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },

  setupItem: {
    width: '100%',
    borderRadius: 15,
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    flexDirection: 'row',
    position: 'relative'
  },

  setupTitle: {
    height: '100%',
    display: 'flex',
    gap: 5
  },

  setupHeadText: {
    color: '#fff',
    fontSize: 20
  },

  setupTextValue: {
    color: 'rgba(255,255,255,.7)',
    fontSize: 15
  },

  setupIcon: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    fontSize: 140,
    color: '#fff',
    opacity: .2
  },

  setupBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 30
  },

  setupBtnText: {
    color: '#fff'
  },

  startPanel: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20
  },

  startWrapper: {
    width: 230,
    height: 60,
    borderRadius: 40,
    padding: 4,
  },

  startBtn: {
    height: '100%',
    width: '100%',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  startBtnText: {
    fontSize: 15,
    color: '#11335a',
    opacity: .7
  }
}