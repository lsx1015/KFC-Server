import React from 'react';
import './App.css';
import {BrowserRouter,Route,Link,Switch} from 'react-router-dom'
import User from './User/User';
import Order from './Order/Order';
import Product from './Product/Product';
import Category from './Category/category';
import { Layout, Menu, Icon } from 'antd';

function App() {
  const { Header, Content, Footer, Sider } = Layout;
  return (
    <Layout>
      <BrowserRouter>
      <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
      >
        <div className="logo" ><img src={require("./img/kfc1.png")}></img><img src={require("./img/KFC.png")}></img></div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/product">
            <Icon type="coffee" />
            <span>产品管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/category">
            <Icon type="appstore" />
            <span>分类管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/order">
            <Icon type="file-text" />
            <span>订单管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/user">
            <Icon type="user" />
            <span>用户管理</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
      <Header style={{ background: '#fff', padding: 0 ,textAlign:'center',fontSize:25}} >KFC后台管理系统</Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight:480  }}>
            
          <Switch>
            <Route exact path="/" component={Product}/>
            <Route path="/order" component={Order}/>
            <Route path="/product" component={Product}/>
            <Route path="/category" component={Category}/>
            <Route path="/user" component={User}/>
           </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>KFC ©2018 Created by 刘少雄</Footer>
      </Layout>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
