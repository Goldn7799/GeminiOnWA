const parser = (text: string) => {
  let parsedText: string = text.replaceAll(/\*\*(.*)\*\*/g, "*$1*")
  parsedText = parsedText.replaceAll(/\* (.*)/g, "- $1")
  return parsedText
}

export default parser