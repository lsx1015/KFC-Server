import React from 'react';
import { Table, Button,Modal} from 'antd';
import $ from 'jquery'

class User extends React.Component{
    constructor(){
        super();
        this.state={
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            UserWhitRole:[],
            form:{
                name:'',
                password:'',
                telephone:'',
                photo:''
            },
            dataloading:false
        }
    }
    componentDidMount(){
       this.loadUsers()
    }
    
    loadUsers=()=>{
        this.setState({dataloading:true})
        let url ="http://203.195.219.213:8183/user/findAllWithRole";
        $.get(url,({status,message,data})=>{
            if(status===200){
                this.setState({
                    UserWhitRole:data,
                    dataloading:false
                });
            }else{
                alert(message)
            }
        })
    }

    start = () => {
        let {selectedRowKeys} = this.state;
        this.setState({ loading: true });
        console.log(JSON.stringify(selectedRowKeys))
        // ajax request after empty completing
        let url = "http://203.195.219.213:8183/user/delUserById";
        selectedRowKeys.forEach(item => {
            $.get(url,{id:item},({status,message})=>{
                if(status===200){
                    // alert(message);
                    this.loadUsers();
                }else{
                    alert(message);
                }
            })
            });
        setTimeout(() => {
            this.setState({
            selectedRowKeys: [],
            loading: false,
            visible:false,
            });
        }, 1000);
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    toAdd=()=>{
        this.setState({visible:true,form:{
            name:'',
            password:'',
            telephone:'',
            photo:'./img/kfc.png'
        }})

    }
    handleCancel =()=>{
        this.setState({
            visible:false
        })
    }
    submitHandler = (event)=>{
        let url = "http://203.195.219.213:8183/user/saveOrUpdate"
        $.post(url,this.state.form,({message})=>{
          // alert(message);
        })
        $.get("http://203.195.219.213:8183/user/findByName",{name:this.state.form.name},({data})=>{
            $.post("http://203.195.219.213:8183/userRole/saveOrUpdate",{userId:data.id,roleId:"1"},({message})=>{
            this.handleCancel();
                //刷新
            this.loadUsers();
            })
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

    delHandler=(id)=>{
        let url ="http://203.195.219.213:8183/user/delUserById?id="+id;
        $.get(url,({status,message})=>{
          if(status ===200){
            alert(message)
            this.loadUsers();
          }else{
            alert(message)
          }
        })
    }
    updateHandler=(id)=>{
      // alert(id)
      let url ="http://203.195.219.213:8183/user/findUserById?id="+id;
      $.get(url,({status,message,data})=>{
        // alert(JSON.stringify(data))
        if(status===200){
          // alert(message)
          
          this.setState({
            visible:true,
            "form":data
          })
          // alert(JSON.stringify(this.state.formDate))
        }else{
          alert(message)
        }
      })
    }

    render(){
        const columns = [
            {
              title: '用户姓名',
              dataIndex: 'name',
              key:'name'
            },
            {
              title: '用户电话',
              dataIndex: 'telephone',
              key:'telephone'
            },
            {
                title:'用户角色',
                dataIndex:'role.name',
                key:'role.name'
            },
            {
                title:'操作',
                render: (record) => <span>
                <Button type="danger" onClick={this.delHandler.bind(this,record.id)}>删除</Button>
                <Button type="link" onClick={this.updateHandler.bind(this,record.id)}>更新</Button>
                </span>,
            }
          ];
        const { dataloading,loading, selectedRowKeys,UserWhitRole,form } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={this.toAdd}>添加用户</Button>
                <Button type="danger" onClick={this.start} disabled={!hasSelected} loading={loading}>
                    批量删除
                </Button>
                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `选择了 ${selectedRowKeys.length} 个用户` : ''}
                </span>
                </div>
                <Table loading={dataloading} rowSelection={rowSelection} rowKey={record => record.id} columns={columns} dataSource={UserWhitRole} />
                <Modal
                title="弹框"
                visible={this.state.visible}
                onOk={this.submitHandler}
                onCancel={this.handleCancel}
                >
                <form onSubmit={this.submitHandler}>
                用户名
                <input type="text" name="name" value={form.name} onChange={this.changeHandler}/><br/>
                用户名密码
                <input type="text" name="password" value={form.password} onChange={this.changeHandler}></input><br/>
                用户电话
                <input type="text" name="telephone" value={form.telephone} onChange={this.changeHandler}></input><br/>
                用户头像
                <input type="text" name="photo" value={form.photo} onChange={this.changeHandler}></input><br/>
                </form>
                </Modal>
            </div>
        );    
    }
}
export default User;