import React, { useMemo, useState } from 'react'
import classes from './ChessBoard.module.css'
import Square from './Square'
import { parsePiece, PieceColor, PieceType, parsePosition } from './model'
import PropTypes from 'prop-types'
import PromotionPieceSelectBox from './PromotionPieceSelectBox'

const DISABLED_AREA_SIZE = 3
const BOARD_SIZE = 14

function NilSquare () {
  return <div className={classes.nilSquare}/>
}

function getSquareByPosition (board, pos) {
  const file = pos[0]
  const rank = pos[1]
  return board[rank][file]
}

function isSquareOccupiedByColor (board, pos, color) {
  const square = getSquareByPosition(board, pos)
  const piece = square.piece
  if (piece) {
    return piece.color === color
  }
  return false
}

function isSquareOccupiedByPawn (board, pos) {
  const square = getSquareByPosition(board, pos)
  const piece = square.piece
  if (piece) {
    return piece.type === PieceType.Pawn
  }
  return false
}

function isPromotionPositionForColor (board, pos, color) {
  if (color === PieceColor.Red) {
    return pos[1] === 7
  }
  if (color === PieceColor.Yellow) {
    return pos[1] === 6
  }
  if (color === PieceColor.Blue) {
    return pos[0] === 7
  }
  if (color === PieceColor.Green) {
    return pos[0] === 6
  }
  return false
}

function isPawnPromotion (board, move, color) {
  return isSquareOccupiedByPawn(board, parsePosition(move.from))
    && isPromotionPositionForColor(board, parsePosition(move.to), color)

}

function areEqualPositions (p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1]
}

function getSquareBoard (board) {
  const squares = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    squares.push([])
    for (let j = 0; j < board[i].length; j++) {
      const square = {
        piece: parsePiece(board[i][j])
      }
      squares[i].push(square)
    }
    const isShortRow = (i >= 0 && i < DISABLED_AREA_SIZE) || (i >= BOARD_SIZE - DISABLED_AREA_SIZE)
    if (isShortRow) {
      for (let j = 0; j < DISABLED_AREA_SIZE; j++) {
        squares[i].unshift(null)
        squares[i].push(null)
      }
    }
  }
  return squares
}

export default function ChessBoard ({
  board,
  legalMoves = [],
  nextMoveColor = 'red',
  isPlayerMove = true,
  eliminatedColors = [],
  colorsInCheck = [],
  observedColor = 'red',
  onMove,
  lastMove = null
}) {
  const [selectedSquarePos, setSelectedSquarePos] = useState(null)
  // Set when user clicked on move destination square but move is a pawn promotion,
  // so he needs to choose piece to which pawn will be promoted before committing a move
  const [promotionMove, setPromotionMove] = useState(null)
  // With square board it is much easier to render disabled board squares (3x3 corners).
  // Also getting square by position is straight forward.
  // This board should be used internally instead of board passed via prop.
  const _board = useMemo(() => getSquareBoard(board), [board])

  const legalMovesForSelectedSquare = useMemo(() => {
      if (selectedSquarePos) {
        return legalMoves
          .filter(move => areEqualPositions(parsePosition(move.from), selectedSquarePos))
      } else {
        return null
      }
    }, [selectedSquarePos, legalMoves]
  )

  function onSquareClick (pos) {
    if (!isPlayerMove) {
      return
    }
    if (selectedSquarePos) {
      const legalMove = legalMovesForSelectedSquare.find(move => areEqualPositions(parsePosition(move.to), pos))
      if (legalMove) {
        if (isPawnPromotion(_board, legalMove, nextMoveColor)) {
          setPromotionMove(legalMove)
        } else {
          onMove(legalMove)
        }
      }
      setSelectedSquarePos(null)
    } else if (isSquareOccupiedByColor(_board, pos, nextMoveColor)) {
      setSelectedSquarePos(pos)
    }
  }

  function onPromotionPieceSelected (piece) {
    onMove({
      ...promotionMove,
      promotionPiece: piece
    })
    setPromotionMove(null)
  }

  function isSquareSelected (pos) {
    if (selectedSquarePos) {
      return areEqualPositions(selectedSquarePos, pos)
    }
    return false
  }

  function isSquareMoveDestination (pos) {
    if (selectedSquarePos) {
      return legalMovesForSelectedSquare.findIndex(move => areEqualPositions(parsePosition(move.to), pos)) !== -1
    }
    return false
  }

  function isLastMoveSquare (pos) {
    if (lastMove) {
      return areEqualPositions(parsePosition(lastMove.from), pos) || areEqualPositions(parsePosition(lastMove.to), pos)
    }
    return false
  }

  function renderBoard () {
    const isTransposed = observedColor === 'blue' || observedColor === 'green'
    const isReversedRowOrder = observedColor === 'red' || observedColor === 'blue'
    const isReversedColumnOrder = observedColor === 'yellow' || observedColor === 'blue'
    const rows = []
    for (let i = 0; i < BOARD_SIZE; i++) {
      const squares = []
      for (let j = 0; j < BOARD_SIZE; j++) {
        const file = isTransposed ? i : j
        const rank = isTransposed ? j : i
        const squarePos = [file, rank]
        const square = getSquareByPosition(_board, squarePos)
        let squareComp
        if (square) {
          const variant = (file + rank) % 2 === 0 ? 'light' : 'dark'
          const piece = square.piece ? {
            ...square.piece,
            isEliminated: eliminatedColors.includes(square.piece.color)
          } : null
          const isChecked = square.piece
            && colorsInCheck.includes(square.piece.color)
            && square.piece.type === PieceType.King
          squareComp = <Square
            key={j}
            variant={variant}
            isSelected={isSquareSelected(squarePos)}
            piece={piece}
            isMoveDestination={isSquareMoveDestination(squarePos)}
            isLastMoveSquare={isLastMoveSquare(squarePos)}
            isChecked={isChecked}
            onClick={() => onSquareClick(squarePos)}
          />
        } else {
          squareComp = <NilSquare key={j}/>
        }
        squares.push(squareComp)
      }
      if (isReversedColumnOrder) {
        squares.reverse()
      }
      const row = <div key={i}>{squares}</div>
      rows.push(row)
    }
    if (isReversedRowOrder) {
      rows.reverse()
    }
    return rows
  }

  return (
    <div className={classes.container}>
      {renderBoard()}
      <div className={classes.promotionPieceSelectBox}>
        {
          promotionMove &&
          <PromotionPieceSelectBox
            pieceColor={nextMoveColor}
            open={true}
            onPieceSelected={onPromotionPieceSelected}/>
        }
      </div>
    </div>
  )
}

ChessBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  nextMoveColor: PropTypes.oneOf(Object.values(PieceColor)),
  isPlayerMove: PropTypes.bool,
  eliminatedColors: PropTypes.arrayOf(PropTypes.oneOf(Object.values(PieceColor))),
  colorsInCheck: PropTypes.arrayOf(PropTypes.oneOf(Object.values(PieceColor))),
  observedColor: PropTypes.oneOf(Object.values(PieceColor)),
  legalMoves: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired
    })
  ),
  lastMove: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  onMove: PropTypes.func
}
