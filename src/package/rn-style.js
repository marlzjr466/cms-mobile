import { StyleSheet } from 'react-native'

const isNumber = str => /^\d+$/.test(str)
export default str => {
  if (typeof str !== 'string') {
    throw 'Invalid arguments'
  }

  return (
    StyleSheet.create({
      get: str.replace(/\n+/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .reduce((acc, curr) => {
          const [prop] = curr.split('-[')
          const [_, value] = curr.includes('-[')
            ? curr.match(/\[(.*?)\]/)
            : ['', null]
          const properties = getProperty(prop)
  
          if (properties === 'Invalid property') {
            throw properties
          }
  
          let style = {}
          if (Array.isArray(properties)) {
            const [props, val] = properties
            style = {
              [props]: val
            }
          } else {
            style = {
              [properties]: value
                ? isNumber(value) || (properties === 'opacity' && value.includes('.') || value.includes('-'))
                  ? +(value) 
                  : value
                : 0
            }
          }
  
          return { ...acc, ...style }
        }, {})
    }).get
  )
}

function getProperty (property) {
  const styles = {
    // flex
    flex: ['display', 'flex'],
    gap: 'gap',
    'flex-1': ['flex', 1],
    'flex-col': ['flexDirection', 'column'],
    'col-reverse': ['flexDirection', 'column-reverse'],
    'flex-row': ['flexDirection', 'row'],
    'row-reverse': ['flexDirection', 'row-reverse'],
    'justify-between': ['justifyContent', 'space-between'],
    'justify-center': ['justifyContent', 'center'],
    'items-center': ['alignItems', 'center'],
    'w-full': ['width', '100%'],
    'h-full': ['height', '100%'],

    // margin
    m: 'margin',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mh: 'marginHorizontal',
    mv: 'marginVertical',

    // padding
    p: 'padding',
    pt: 'paddingTop',
    pr: 'paddingRight',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    ph: 'paddingHorizontal',
    pv: 'paddingVertical',

    // radius
    br: 'borderRadius',
    bblr: 'borderBottomLeftRadius',
    btlr: 'borderTopLeftRadius',
    bbrr: 'borderBottomRightRadius',
    btrr: 'borderTopRightRadius',

    // border
    bc: 'borderColor',
    bw: 'borderWidth',
    b: 'border',
    bbw: 'borderBottomWidth',
    bbc: 'borderBottomColor',

    // position
    absolute: ['position', 'absolute'],
    relative: ['position', 'relative'],
    fixed: ['position', 'fixed'],

    // sides
    top: 'top',
    left: 'left',
    bottom: 'bottom',
    right: 'right',
    inset: ['inset', 0],

    w: 'width',
    h: 'height',
    bg: 'backgroundColor',
    opacity: 'opacity',
    color: 'color',
    fs: 'fontSize',
    zIndex: 'zIndex',
    shadow: 'elevation',
    'overflow-hidden': ['overflow', 'hidden'],
    'text-center': ['textAlign', 'center'],
    'text-left': ['textAlign', 'left'],
    'text-right': ['textAlign', 'right']
  }

  if (!(property in styles)) {
    return 'Invalid property'
  }

  return styles[property]
}