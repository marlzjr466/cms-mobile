const useScreenSize = () => {
  return {
    width: global.$windowWidth,
    height: global.$windowHeight
  }
}

export { useScreenSize }