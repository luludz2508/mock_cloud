import React, { useState, useEffect } from "react";
import SearchBar from './SearchBar'
import Axios from "axios";

const CRUD = ({ category, list, onAdd, onEdit, onDelete, pageable, onSearch }) => {
    const [data, setData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1)

    useEffect(() => {
        setIsEdit(data.id != null);
    }, [data])

    useEffect(() => {
        setTotalPages(pageable.totalPages)
        setPage(pageable.page)
    }, [pageable])

    const handleSaveClick = () => {
        var emailRe = new RegExp("@");
        var phoneRe = /^\d{10,20}$/
        var addRe = /^\w{10,20}$/
        var nameRe =  /^\w+( \w+)*$/
        var errorMess = ''
        console.log()
        // if (data.email ==null || !emailRe.test(data.email)) {
        //     errorMess += 'Invalid email \n';
        // }
        //
        // if (data.phone ==null || !phoneRe.test(data.phone)) {
        //     errorMess += 'Invalid phone \n';
        // }

        // if (data.address ==null || !addRe.test(data.address)) {
        //     errorMess += 'Invalid address \n';
        // }
        //
        // if (data.fullname ==null || !nameRe.test(data.fullname)) {
        //     errorMess += 'Invalid fullname \n';
        // }
        // if (data.parent ==null || !nameRe.test(data.parent)) {
        //     errorMess += 'Invalid parent name \n';
        // }

        if (errorMess !== '') {
            window.alert(errorMess)
            return;
        }

        handleClear();
        if (data.grade == null) data.grade = 1;
        isEdit ? onEdit(data) : onAdd(data)
    }

    const handleEditClick = (object) => {
        setData(object);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you wish to delete this item?')) {
            onDelete(id);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
        console.log(value)
    };

    const handleClear = () => {
        Array.from(document.querySelectorAll("input")).forEach(
            (input) => (input.value = "")
        );
        setData({})
    };

    return (
        <div className="row ">
            {/* First column: Add or Edit form */}
            <div className="col-4">
                <h2 style={{ marginBottom: '25px' }}>
                    {isEdit ? "Edit" : "Add"} {category.name.slice(0, -1)}
                </h2>
                {/* Input Form */}
                <div>
                    {category.fields.map((field, index) => (
                        <div className="form-group" key={index}>
                            <label style={{ textTransform: "capitalize" }}>{field}</label>
                            {field === "grade" ? <select class="form-control" name={field} value={data.grade} onChange={handleInputChange} >
                                    {[...Array(13).keys()].slice(1).map(number => <option value={number}>{number}</option>)}
                                </select>
                                : <input type="text" className="form-control" name={field} value={data[`${field}`]} onChange={handleInputChange} />}
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={() => handleSaveClick()}> Save </button>
                    {isEdit &&
                    <button type="button" className="btn" onClick={() => handleClear()}> Cancel </button>}
                </div>
            </div>
            {/* Second column: View table */}
            <div className="col-8 ">
                <h2>View {category.name}</h2>
                <SearchBar fields={category.fields} onSearch={onSearch} selectedField="fullname"/>
                <ViewTable />
                <Pagination />
            </div>
        </div>
    );

    function Pagination() {
        return (
            <nav >
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <button type="button" className="page-link" disabled={page === 1} style={page === 1 ? { color: 'lightgray' } : null} onClick={() => pageable.setPage(page => page - 1)}>
                            <span>&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </button>
                    </li>
                    {[...Array(totalPages + 1).keys()].slice(1).map((number, i) =>
                        <li className={`page-item ${page === number && "active"}`} key={i}>
                            <button className="page-link" onClick={() => pageable.setPage(number)}>{number}</button>
                        </li>
                    )}
                    <li className="page-item">
                        <button type="button" className="page-link" disabled={page === totalPages} style={page === totalPages ? { color: 'lightgray' } : null} onClick={() => pageable.setPage(page => page + 1)}>
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </button>
                    </li>
                </ul>

            </nav>
        )
    }

    function SortButton() {
        return (<button className="btn btn-sm" type="button"><span>&uarr;</span></button>)
    }

    function ViewTable() {
        // console.log(list[0])
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    {category.fields.map((field, index) => <th scope="col" key={index}>{field}</th>)}
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {list.length > 0 ?
                    list.map((object) => (
                        <tr key={object.id}>
                            <td>{object.id}</td>
                            {category.fields.map((field, index) => <td key={index}>{object[`${field}`]}</td>)}
                            <td>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditClick(object)} style={{ marginRight: '5px' }}>Edit</button>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteClick(object.id)}>Delete</button>
                            </td>
                        </tr>
                    )) :
                    <tr><td colSpan={category.fields.length + 2}>No data</td></tr>
                }
                </tbody>
            </table>
        );
    }
};

export default CRUD;
