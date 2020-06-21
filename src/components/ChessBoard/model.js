export const PieceType = {
  Pawn: 'pawn',
  Knight: 'knight',
  Bishop: 'bishop',
  Rook: 'rook',
  Queen: 'queen',
  King: 'king'
}

export const PieceColor = {
  Red: 'red',
  Blue: 'blue',
  Yellow: 'yellow',
  Green: 'green'
}

function parsePieceType (char) {
  switch (char) {
    case 'P':
      return PieceType.Pawn
    case 'N':
      return PieceType.Knight
    case 'B':
      return PieceType.Bishop
    case 'R':
      return PieceType.Rook
    case 'Q':
      return PieceType.Queen
    case 'K':
      return PieceType.King
    default:
      return null
  }
}

function parsePieceColor (char) {
  switch (char) {
    case 'r':
      return PieceColor.Red
    case 'b':
      return PieceColor.Blue
    case 'y':
      return PieceColor.Yellow
    case 'g':
      return PieceColor.Green
    default:
      return null
  }
}

export function parsePiece (str) {
  if (str.length !== 2) {
    return null
  }
  const pieceColor = parsePieceColor(str[0])
  const pieceType = parsePieceType(str[1])
  return ({
    color: pieceColor,
    type: pieceType
  })
}

export function parsePosition (str) {
  const file = str.charCodeAt(0) - 'a'.charCodeAt(0)
  const rank = parseInt(str.substring(1)) - 1
  return [file, rank]
}
