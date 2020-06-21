import React from 'react'
import classes from './PromotionPieceSelectBox.module.css'
import PropTypes from 'prop-types'
import { PieceColor, PieceType } from './model'
import {getIcon} from './utils'

const pieces = [PieceType.Queen, PieceType.Rook, PieceType.Bishop, PieceType.Knight]

function defaultOnPieceSelected () {}

export default function PromotionPieceSelectBox ({ pieceColor, onPieceSelected = defaultOnPieceSelected }) {
  return <div className={classes.container}>
    {
      pieces.map(piece =>
        <>
          <img
            className={classes.icon}
            src={getIcon(piece, pieceColor)}
            onClick={() => onPieceSelected(piece)}
            alt={piece}/>
          <div className={classes.separator}/>
        </>
      )
    }
  </div>
}

PromotionPieceSelectBox.propTypes = {
  open: PropTypes.bool,
  pieceColor: PropTypes.oneOf(Object.values(PieceColor)).isRequired,
  onPieceSelected: PropTypes.func
}
