import React, { useMemo } from 'react'
import classes from './Square.module.css'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PieceColor, PieceType } from 'components/ChessBoard/model'
import {getIcon} from './utils'

export default function Square ({
  variant,
  piece,
  isSelected = false,
  isMoveDestination = false,
  isLastMoveSquare = false,
  isChecked = false,
  onClick
}) {
  const pieceIcon = useMemo(() =>
    piece
      ? getIcon(piece.type, piece.isEliminated ? 'gray' : piece.color)
      : null, [piece])

  return (
    <div
      className={classNames(classes.square, classes[variant], isLastMoveSquare && classes.lastMove, isChecked && classes.checked)}
      onClick={onClick}>
      {isMoveDestination && <div className={classes.moveDestinationIndicator}/>}
      {piece && <img
        className={classNames(classes.piece, isSelected && classes.selected)}
        src={pieceIcon}
        alt='piece'
        draggable='false'/>
      }
    </div>
  )
}

Square.propTypes = {
  variant: PropTypes.oneOf(['light', 'dark']).isRequired,
  piece: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(PieceType)).isRequired,
    color: PropTypes.oneOf(Object.values(PieceColor)).isRequired,
    isEliminated: PropTypes.bool
  }),
  isSelected: PropTypes.bool,
  isMoveDestination: PropTypes.bool,
  isLastMoveSquare: PropTypes.bool,
  isChecked: PropTypes.bool,
  onClick: PropTypes.func
}
