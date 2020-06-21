export function getIcon (pieceType, pieceColor) {
  return require(`./icons/${pieceColor}/${pieceType}.svg`)
}
