
import React, {Component} from 'react';
const iconSize = [12, 12];

class Line extends Component {
  constructor(props) {
    super(props);
  }
  removeHandle() {
    this.props.removeRelation(this.props.data);
  }
  render() {
    const {
      startX = 0,
      startY = 0,
      endX = 0,
      endY = 0,
      currentRelation,
      data
    } = this.props;
    return <g className={`path-end ${(currentRelation === data) ? "active" : ""}`} onMouseOver={() => {
      this.props.toTop(this.props.data);
    }} onClick={this.removeHandle.bind(this)}>
      <path
        className="line"
        d={`M${startX}, ${startY} L${endX}, ${endY}`}
        markerEnd="url(#markerArrow)"
      ></path>
      <image
        className="icon-remove"
        x={(endX + startX - iconSize[0])/2}
        y={(endY + startY - iconSize[1])/2}
        width={iconSize[0]}
        height={iconSize[1]}
        xlinkHref="//img.alicdn.com/tfs/TB1laCNsXYqK1RjSZLeXXbXppXa-200-200.png" />
    </g>;
  }
}

export default Line;