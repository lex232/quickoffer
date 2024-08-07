import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

import items_api from '../../../api/items_api';
import './styles.css'
import AddNewLine from '../../../utils/text-operations/addNewLine';

const ItemsArea = ({ category_id, loginstate, title }) => {
    /**
    * Блок товаров в каталоге
    */

    const [ listItems, setListItems ] = useState([])
    const [ isLoaddingItems, setIsLoaddingItems ] = useState(true);

    const [page, setPage] = useState(0);
    const [pageCount, setpageCount] = useState(0);
    let currentpage = 1;

    let items = []

    // Получаем корзину из локального хранилища
    if (localStorage.getItem("items")) {
        items = JSON.parse(localStorage.getItem("items"));
    }

    useEffect(() => {
        // Получить все товары при загрузке страницы
        getItems(currentpage, category_id);
        currentpage = 1;
      }, [category_id])
      ;

    const getItems = (page, category_id) => {
        // Получить список категорий товаров
        items_api.getItemsFilterCategoryPaginate({
            page: page,
            group: category_id
    })
        .then(res => {
            setpageCount(Math.ceil(res.count / 10));
            setListItems(res.results);
        })
        .catch((e) => console.log(e))
        .finally(()=> setIsLoaddingItems(false))
      }


    /**
    * Обработать клик паджинатора
    */
    const handlePageClick = (data) => {
        setPage(data.selected + 1)
        currentpage = data.selected + 1;
        getItems(currentpage, category_id);
    };

    /**
    * Проверяем на одинаковый товар
    */
    const CheckCartItem = (id_item) => { 
        var index
        for (index = 0; index < items.length; ++index) {
          if (id_item === items[index].id) {
            return true
          }
        }
        return false
      }

    /**
    * Проверяем количество товара, если товар в корзине
    */
    const CheckCartQuantity = (cart, id_item) => {
        var index
        for (index = 0; index < cart.length; ++index) {
          if (id_item === cart[index].id) {
            return Number(cart[index].amount)
          }
        }
        return 1
    }

    const CartPlusItem = ( results, e) => {
    // Добавляем элемент в список товаров/услуг
        e.preventDefault();

        let prepareToAddList = items;

        prepareToAddList.push({
            id: results.id,
            title: results.title,
            item_price_retail: results.price_retail,
            item_price_purchase: results.price_retail,
            amount: "1",
            description: results.description ,
            image: results.image
        })
        localStorage.setItem("items", JSON.stringify(prepareToAddList));
        getItems(currentpage, category_id);
        window.dispatchEvent(new Event("storage"));
    }

    const CartRemoveItem = ( id_item, e ) => {
        // Удаляем элемент из списка товаров/услуг по id товара
        e.preventDefault();

        let prepareToDeleteList = items;
        var index = items.findIndex(p => p.id === id_item)
        prepareToDeleteList.splice(index, 1)
        localStorage.setItem("items", JSON.stringify(prepareToDeleteList));
        getItems(currentpage, category_id);
        window.dispatchEvent(new Event("storage"));
    }

    return (
        <div className="col">
            <div className="d-flex">
                {isLoaddingItems && <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>}
            </div>
            
            <div className="container-fluid">
            <h4 className='text-start pb-2'>{title}</h4>
                <div className="row justify-content-start">
                    {listItems.map((results) => {
                        return (
                            <div className="col-6 col-xl-3 col-xxl-2 mb-5">
                                <div className="card h-100">
                                    <div className='area-img'>
                                        <img className="card-image" src={results.image} />
                                    </div>
                                    <div className="card-body p-2">
                                        <div className="text-start">
                                            <h6 className="fw-bolder">{results.title}</h6>
                                            <div className='item-brand'>Производитель: <b>{results.brand}</b></div>
                                            <div className='description-item py-1'>{AddNewLine(results.description)}</div>
                                            <div className='item-price'><b>{results.price_retail} руб.</b></div>
                                        </div>
                                    </div>
                                    {loginstate && <div className="card-footer d-flex p-2 pt-0 border-top-0 bg-transparent">
                                        {CheckCartItem(results.id) ?
                                            <div className="justify-content-start text-start col-8"><button className="btn btn-primary btn-sm">Добавлено в КП</button></div> : 
                                            <div className="justify-content-start text-start col-8"><button onClick={(e) => CartPlusItem(results, e)} className="btn btn-light btn-sm">Добавить в КП</button></div>}
                                        <div className="justify-content-end text-end col-4">
                                            {CheckCartItem(results.id) && 
                                            <span>
                                                {CheckCartQuantity(items, results.id)} Шт.
                                                <button className="btn btn-primary btn-sm ms-2" onClick={(e) => CartRemoveItem(results.id, e)}>X</button>
                                            </span>}
                                        </div>
                                    </div>}
                                </div>
                            </div>
                            );
                        })}   
                </div>
            </div>

            <ReactPaginate
                previousLabel={"предыдущая"}
                nextLabel={"следующая"}
                initialPage={page}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
            />
        </div>
      );
    };
    
    export default ItemsArea;