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
        name:"",
        description:"",
        price:"",
        status:"",
        xiaoliang:"",
        categoryId:"",
      },
      category:[]
    }
  }

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
submitHandler = (event)=>{
    let url = "http://203.195.219.213:8183/product/saveOrUpdate"
    $.post(url,this.state.form,({message})=>{
      // alert(message);
      //刷新
      this.loadProduct();
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
  loadProduct(){
    $.get("http://203.195.219.213:8183/product/findAllProductWithCategory",({status,message,data})=>{
      if(status === 200){
        this.setState({
          "product":data,
          form:{...this.state.form,...{productId:data[0].id}}
        })
      } else {alert (message)}
    })
  }
  componentDidMount(){
    // 1. 加载产品信息
    this.loadProduct();
    this.loadcategory();
  }
loadcategory=()=>{
  let url ="http://203.195.219.213:8183/category/findAll";
  $.get(url,({data})=>{
    this.setState({category:data})
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
     this.delAllProduct(ck[i]);
    }
  }
  delAllProduct(id){
    var a = id+1;
    let url = 'http://203.195.219.213:8183/product/delProductById?id='+a;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadProduct();
      }else{
        alert(message);
      }
    })
  }
  toAdd = () =>{
    this.setState({
      visible:true,
      form:{
        id:"",
        name:"",
        description:"",
        price:"",
        status:"",
        xiaoliang:"",
        categoryId:"1",
      }
    })
  }
  delProduct(id){
    let url = 'http://203.195.219.213:8183/product/delProductById?id='+id;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.loadProduct();
      }else{
        alert(message);
      }
    })
  }
  toUpdate(id){
    // 1. 通过id查找课程信息
    // 2. 将返回结果设置到this.state.form中
    // state->form
    $.get("http://203.195.219.213:8183/product/findProductById?id="+id,({status,message,data})=>{
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
    let {form,category} = this.state;
    // alert(JSON.stringify(category))
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '介绍',
        dataIndex: 'description',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '分类',
        dataIndex: 'category.chinesename',
      },
      {
        title: '销量',
        dataIndex: 'xiaoliang',
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
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.product} />
      </div>
    
      <Modal
          title="输入添加的菜品信息，点击确定提交"
          visible={this.state.visible}
          onOk={this.submitHandler}
          onCancel={this.handleCancel}
        >
        <p>
         <form>
          菜品名称<br/>
          <input type="text" placeholder="请输入菜品名称" name="name" value={form.name} onChange={this.changeHandler}/> <br/>
          菜品介绍<br/>
          <input type="text" placeholder="请输入菜品介绍" name="description" value={form.description} onChange={this.changeHandler}/> <br/>
          价格<br/>
          <input type="text" placeholder="请输入价格" name="price" value={form.price} onChange={this.changeHandler}/> <br/>
          库存状态<br/>
          <input type="text" placeholder="请输入库存状态" name="status" value={form.status} onChange={this.changeHandler}/> <br/>
          销量<br/>
          <input type="text" placeholder="请输入销量" name="xiaoliang" value={form.xiaoliang} onChange={this.changeHandler}/> <br/>
          选择分类<br/>
          <select value={form.categoryId} name="categoryId" onChange={this.changeHandler}>
              {
                  category.map((item)=>{
                    return <option key={item.id} value={item.id}>{item.chinesename}</option>
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