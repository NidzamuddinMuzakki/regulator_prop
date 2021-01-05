
import React, {Component} from 'react';
import Sortable from 'sortablejs';

//import Columns from './Columns.jsx';
//const Columns = React.lazy(() => import('./Columns'));
import Columns from './Columns'

class SourceData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      sorting: false
    };
  }

  componentDidMount() {
    const { isSort } = this.props;
    const ele = this.boxEle.querySelector('.column-content');
    let order = [];
    if(isSort) {
      const sortable =  new Sortable(ele, {
        onStart: () => {
          this.setState({
            sorting: true
          });
        },
        onEnd: (evt) => {
          sortable.sort(order);//sortablejs排序还原
          this.props.changeData(evt.oldIndex, evt.newIndex);
          this.setState({
            sorting: false
          });
        }
      });
      order = sortable.toArray();
    }
  }
  show(data, relation, iconStatus) {
    const arr = iconStatus ? relation.concat(iconStatus) : relation;
    return data.map(item => {
      let iconShow = 'hidden';
      arr.map(n => {
        if (n.key === item.key || (n.source && n.source.key) === item.key) iconShow = 'inherit';
      });
      item.iconShow = iconShow;
      return item;
    });
  }
  isActive(key) {
    const { currentRelation } = this.props;
    const className = [];
    if(this.state.activeKey === key) {
      className.push("active");
    }else if (currentRelation.source && currentRelation.source.key === key) {
      className.push("active");
    }
    return className.join(" ");
  }
  render() {
    const {
      columns,
      data,
      iconStatus,
      overActive,
      relation
    } = this.props;
    const { sorting } = this.state;
    const columnOpt = (item, index) => {
      return {
        "data-id": index,
        "data-key": item.key,
        className: this.isActive(item.key),
        onMouseEnter: () => {
          !sorting && this.setState({
            activeKey: item.key
          }, () => {
            overActive(item,  "source", "enter");
          });
        },
        onMouseLeave: () => {
          !sorting && this.setState({
            activeKey: null
          }, () => {
            overActive(item, "source", "leave");
          });
        }
      };
    };
    const renderContent = this.show(data, relation, iconStatus);
    return <div className="source-data" ref={(me) => {this.boxEle = me;}} >
      <ul className="column-title">
        <li>
          {columns.map((column, idx) => {
            return (
              <span
                key={idx}
                className="column-item"
                title={column.title}
                style={{
                  width: column.width,
                  textAlign: column.align
                }}
              >
                {column.title}
              </span>
            );
          })}
        </li>
      </ul>
      <ul className="column-content">
        {
          renderContent.map((item, index) => {
            return (
              <Columns
                columns={columns}
                key={`source_${index}`}
                columnOpt={columnOpt}
                sorting={sorting}
                item={item}
                index={index}
                type="source"
              />
            );
          })
        }
      </ul>
    </div>;
  }
}

export default SourceData;