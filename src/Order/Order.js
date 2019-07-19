import React from 'react'
import { Layout, Table, Button, Modal} from 'antd';
import $ from 'jquery';
import Item from 'antd/lib/list/Item';
const { Content, Footer, } = Layout;
class Product extends React.Component {
  constructor(){
    super();
    this.state = {
      selectedRowKeys: [],
      visible: false,
      formLayout: 'horizontal',
      form:{
        orderTime:"",
        status:"",
        userId:""
      },
      users:[]
    }
  }
 
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  submitHandler = (event)=>{
    let url = "http://203.195.219.213:8183/order/saveOrUpdate"
    $.post(url,this.state.form,({message})=>{
      // alert(message);
      //刷新
      this.loadOrder();
      this.handleCancel();
    })
    event.preventDefault();
  }

  changeHandler = (event)=>{
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      form:{...this.state.form,...{[name]:value}}
    })
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  loadUser=()=>{
    let url = "http://203.195.219.213:8183/user/findAllUser";
    $.get(url,({status,message,data})=>{
      if(status===200){
        this.setState({users:data})
      }else{
        alert(message)
      }
    })
  }

  delAll= () => {
    console.log(this.state.selectedRowKeys);
    let ck = this.state.selectedRowKeys;
    if(ck.length == 0){
      alert("请选择,然后进行删除");
     return;
    }
    for(var i = 0; i < ck.length; i++){
     this.delAllOrder(ck[i]);
    }
  }
  delAllOrder(id){
    var a = id+1;
    let url = 'http://203.195.219.213:8183/order/delOrderById?id='+a;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadOrder();
      }else{
        alert(message);
      }
    })
  }
loadOrder(){
    $.get("http://203.195.219.213:8183/order/findAllOrderWithUser",({status,message,data})=>{
      if(status === 200){
        this.setState({
          "Order":data,
          form:{...this.state.form,...{OrderId:data[0].id}}
        })
      } else {alert (message)}
    })
  }

componentDidMount(){
    // 1. 加载产品信息
    this.loadOrder();

    this.loadUser();
  }

toAdd = () =>{
    this.setState({
      visible:true,
      form:{
        orderTime:"",
        status:"",
        userId:"1"
      }
    })
  }

delOrder(id){
    let url = 'http://203.195.219.213:8183/order/delOrderById?id='+id;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadOrder();
      }else{
        alert(message);
      }
    })
  }
  toUpdate(id){
    // 1. 通过id查找课程信息
    // 2. 将返回结果设置到this.state.form中
    // state->form
    $.get("http://203.195.219.213:8183/order/findOrderById?id="+id,({status,message,data})=>{
      if(status === 200){
        // 将查询数据设置到state中
        this.setState({ 
          visible:true,
          "form":data
         })
      } else {alert (message)}
    })
  }
  

  render(){
    let {form,users} = this.state;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
      },
      {
        title: '下单用户',
        dataIndex: 'user.name',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button type="primary" onClick={this.toUpdate.bind(this,record.id)}>更新</Button>
            <span> </span>
            <Button type="danger" onClick={this.delOrder.bind(this,record.id)}>删除</Button>
          </span>
        ),
      },
    ];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [
        {
          key: 'all-data',
          text: '选择全部',
          onSelect: () => {
            this.setState({
              selectedRowKeys: [...Array(46).keys()], // 0...45
            });
          },
        },
        {
          key: 'odd',
          text: '选择奇数列',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
        {
          key: 'even',
          text: '选择偶数列',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ],
      onSelection: this.onSelection,
    };
    return (
    <div>
      <div>
        <Button type="primary" onClick={this.toAdd}>添加</Button>
        <Button type="danger" onClick={this.delAll}>批量删除</Button>
      </div>
      
      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.Order} />
      </div>
               
      <Modal
          title="输入手动添加的订单 点击确定后提交"
          visible={this.state.visible}
          onOk={this.submitHandler}
          onCancel={this.handleCancel}
        >
        <p>
         <form>
          下单时间<br/>
          <input type="text" placeholder="请输入下单时间" name="orderTime" value={form.orderTime} onChange={this.changeHandler}/> <br/>
          订单状态<br/>
          <input type="text" placeholder="请输入订单状态" name="status" value={form.status} onChange={this.changeHandler}/> <br/>
          下单用户<br/>
          <select value={form.userId} name="userId" onChange={this.changeHandler}>
              {
                  users.map((item)=>{
                    return <option key={item.id} value={item.id}>{item.name}</option>
                  })
              }
          </select>
          </form>
        </p>
        </Modal>
    </div>
    )
  }
}

export default Product;