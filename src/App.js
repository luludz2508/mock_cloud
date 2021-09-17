// import "./index.css";
import "./App.css";
import { useEffect, useState } from "react";
import CRUD from "./CRUD";
import Axios from "axios";
import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
// const CATEGORIES = [, { name: 'teachers', fields: ['name', 'expertise', 'phone', 'address'] }, { name: 'courses' }, { name: 'products' }];
// const API_PATH = "http://ec2-54-255-149-72.ap-southeast-1.compute.amazonaws.com/"
const API_PATH = "http://testmock-env.eba-uudbjrrb.ap-southeast-1.elasticbeanstalk.com/";
const category = {
    name: 'cinemas',
    fields: ['name',  'company', 'address']
    // fields: ['name',  'company', 'address', 'phone', 'email']
};
function App() {

    //const [category, setCategory] = useState(CATEGORIES[0]);
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState(false);

    useEffect(() => {
        if (search) return;
        Axios.get(API_PATH + category.name, {params: {page: page}})
            .then(res=>{
                console.log(res.data);
                setList(res.data)
                let count = res.data.length;
                setTotalPages(count === 0? 1 : count)
            })
            .catch(error => console.log("Getting list error" + error))
    }, [page])

    function onSearch(text, select) {
        setSearch(true);
        Axios.get(API_PATH + category.name + "/" + select, {params: {page: 1, name: text}})
            .then(res => {
                console.log(res)
                setList(res.data.list)
                let count = res.data.totalPages;
                setTotalPages(count === 0? 1 : count)
                setSearch(false)
            })
        setPage(1);

    }

    const onAdd = (data) => {
        Axios.post(API_PATH + category.name, data)
            .then(res => {
                console.log(res.data);
                setList(list => [...list, {...data, id: res.data.id}])
            })
            .catch((error) => console.log("Adding error" + error))
    };

    const onEdit = (data) => {
        Axios.put(API_PATH + category.name, data)
            .then(res => {
                console.log(res);
                setList(list => list.map((o) => (o.id === data.id ? data : o)))
            })
            .catch((error) => console.log("Editting error" + error))
    };

    const onDelete = (id) => {
        Axios.delete(API_PATH + category.name + '/' + id)
            .then(res => {
                console.log(res);
                setList((list) => list.filter((o) => o.id !== id));
            })
    };

    return (
        <div className="container-fuild">
            {/* <NavBar /> */}
            <div style={{ margin: '30px' }}>
                <CRUD
                    category={category}
                    list={list}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    pageable={{totalPages: totalPages, page: page, setPage: setPage}}
                    onSearch={onSearch}
                />
            </div>
        </div>
    );

}



export default App;
