import React from 'react'
import { Layout, Table, Button, Modal} from 'antd';
import $ from 'jquery';
const { Content, Footer, } = Layout;
class Product extends React.Component {
  constructor(){
    super();
    this.state = {
      selectedRowKeys: [],
      visible: false,
      formLayout: 'horizontal',
      form:{
        id:"",
        chinesename:"",
        icon:"",
        englishname:"",
      }
    }
  }
  
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  submitHandler = (event)=>{
    let url = "http://203.195.219.213:8183/category/saveOrUpdate"
    $.post(url,this.state.form,({message})=>{
      // alert(message);
      //刷新
      this.loadCategory();
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

  delAll= () => {
    console.log(this.state.selectedRowKeys);
    let ck = this.state.selectedRowKeys;
    if(ck.length == 0){
      alert("请选择,然后进行删除");
     return;
    }
    for(var i = 0; i < ck.length; i++){
     this.delAllProduct(ck[i]);
    }
  }
  delAllProduct(id){
    var a = id+1;
    let url = 'http://203.195.219.213:8183/category/deleteCategory?id='+a;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadCategory();
      }else{
        alert(message);
      }
    })
  }
  loadCategory(){
    $.get("http://203.195.219.213:8183/category/findAll",({status,message,data})=>{
      if(status === 200){
        this.setState({
          "category":data,
          form:{...this.state.form,...{productId:data[0].id}}
        })
      } else {alert (message)}
    })
  }

  componentDidMount(){
    // 1. 加载产品信息
    this.loadCategory();
  }

toAdd = () =>{
    this.setState({
      visible:true,
      form:{
        id:"",
        chinesename:"",
        icon:"",
        englishname:"",
      }
    })
  }

delProduct(id){
    let url = 'http://203.195.219.213:8183/category/deleteCategory?id='+id;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadCategory();
      }else{
        alert(message);
      }
    })
  }
  toUpdate(id){
    // 1. 通过id查找课程信息
    // 2. 将返回结果设置到this.state.form中
    // state->form
    $.get("http://localhost:8082/category/findCategoryById?id="+id,({status,message,data})=>{
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
    let {form} = this.state;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '中文名',
        dataIndex: 'chinesename',
      },
      {
        title: '图标位置',
        render:(record) =>(
          <img style={{width:30,height:30}} src={record.icon}/>
        )
      },
      {
        title: '英文名字',
        dataIndex: 'englishname',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button type="primary" onClick={this.toUpdate.bind(this,record.id)}>更新</Button>
            <span> </span>
            <Button type="danger" onClick={this.delProduct.bind(this,record.id)}>删除</Button>
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
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.category} />
      </div>
      <Modal
          title="输入食品分类，点击确定提交信息"
          visible={this.state.visible}
          onOk={this.submitHandler}
          onCancel={this.handleCancel}
        >
        <p>
         <form onSubmit={this.submitHandler}>
          中文名称<br/>
          <input type="text" placeholder="请输入中文名称" name="chinesename" value={form.chinesename} onChange={this.changeHandler}/> <br/>
          图标位置<br/>
          <input type="text" placeholder="请输入图标存放的位置" name="icon" value={form.icon} onChange={this.changeHandler}/> <br/>
          英文名称<br/>
          <input type="text" placeholder="请输入英文名称" name="englishname" value={form.englishname} onChange={this.changeHandler}/> <br/>
          {/* <input type="submit" value="提交"/> */}
        </form>
        </p>
        </Modal>
    </div>
    )
  }
}

export default Product;