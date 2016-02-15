import React from 'react';
import _ from 'lodash';
import css from './MysqlPortalV1.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Nav, NavItem, Grid, Row, Col, Panel } from 'react-bootstrap';
import { debug, fetch, tr, notNull, space } from './util';
import NodeList from './NodeList.js';
import ParamModification from './ParamModification.js';
import LeftPanel from './LeftPanel.js';
import Test from './Test.js';
import Task from './Task.js';

const MysqlPortalV1 = React.createClass({
  getInitialState() {
    return { appInfo: {}, nodeInfo: {}, paramsInfo: {}, tabIndex: 0 };
  },

  async componentWillMount() {
    const appInfo = await fetch('/v1/app/info');
    this.setState({ appInfo });
    const nodeInfo = await fetch('/v1/node/info');
    this.setState({ nodeInfo });
    const paramsInfo = await fetch('/v1/params/info');
    this.setState({ paramsInfo });
    debug('load', appInfo, nodeInfo, paramsInfo);
  },

  onSaveParams(param, value) {
    debug('onSaveParams', param, value);
  },

  render() {
    debug('render');
    const { appInfo, tabIndex, nodeInfo, paramsInfo } = this.state;

    const Tabs = {
      '节点': <NodeList appInfo={appInfo} nodeInfo={nodeInfo}/>,
      '监控': null,
      '参数修改': <ParamModification
        paramsInfo={paramsInfo}
        onSaveParams={this.onSaveParams}
      />,
      '操作日志': null,
      '备份': null,
      '任务': <Task/>,
      Test: <Test/>,
    };

    const Navs = _.keys(Tabs).map((v, index) => {
      return <NavItem key={index} eventKey={index}>{v}</NavItem>;
    });

    return (
      <div className={css.root}>
        <Grid>
          <Row>
            <Col xs={3}>
              {LeftPanel(appInfo)}
            </Col>
            <Col xs={9}>
              <Nav bsStyle="tabs"
                   activeKey={tabIndex}
                   onSelect={tabIndex => this.setState({ tabIndex })}>
                {Navs}
              </Nav>
              <Panel >
                {notNull(_.values(Tabs)[tabIndex])}
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
});

export default withStyles(MysqlPortalV1, css);