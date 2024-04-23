import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import items_api from '../../../api/items_api';
import clients_api from '../../../api/clients_api';
import offer_api from '../../../api/offer_api';

import { ReactComponent as PlusIco } from '../../../static/image/icons/plus-square.svg'
import { ReactComponent as DeleteIco } from '../../../static/image/icons/delete.svg'
import ItemSearch from '../../item-search';
import ClientsSearch from '../../clients-search';
import './styles.css'

const OfferForm = ({
  id,
  name_offer,
  name_client,
  status_type
}) => {

  const navigate = useNavigate()
  const [ nameArea, setName ] = useState(name_offer)
  const [ clientArea, setClient ] = useState(name_client)

  // Самая главная переменная - итоговый список КП
  let items = []

  // Очищаем локальное хранилище (тестирование)
  // localStorage.clear()
  // Сохраняем корзину в локальное хранилище
  if (localStorage.getItem("items")) {
    items = JSON.parse(localStorage.getItem("items"));
  }
  
  // Итоговая стоимость КП
  const [ finallyPrice, setFinallyPrice ] = useState(0)
  
  // Блок поиска для товаров
  // itemList - полученный список товаров из бэкенда (поиска API)
  const [ itemList, setItemList ] = useState()
  // itemValue - в процессе поиска используем title,
  // По завершению поиска - заполняем все поля
  const [ itemValue, setItemValue ] = useState({
    title: '',
    price_retail: 0,
    image: '',
    description: '',
    id: null
  })
  // Показывать ли div с результатами поиска?
  const [ showItems, setShowItems ] = useState(false)

  // Блок поиска для клиентов
  // clientsList - полученный список клиентов из бэкенда (поиска API)
  const [ clientList, setClientList ] = useState()
  // clientValue - в процессе поиска используем title,
  // По завершению поиска - заполняем все поля
  const [ clientValue, setClientValue ] = useState({
    title: '',
    id: null
  })
  // Показывать ли div с результатами поиска клиентов?
  const [ showClients, setShowClients ] = useState(false)

  // состояние DragNDrop
  const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
    }

  // Состояние листа DragNDrop
  const [list, setList] = useState(items);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  // UseEffect для динамического поиска товаров
  useEffect(_ => {
    if (itemValue.title === '') {
      return setItemList([])
    }
    items_api
      .findItem({ item: itemValue.title })
      .then(inputitems => {
        setItemList(inputitems)
      })
  }, [itemValue.title])

    // UseEffect для динамического поиска клиентов
    useEffect(_ => {
      if (clientValue.title === '') {
        return setClientList([])
      }
      clients_api
        .findClient({ client: clientValue.title })
        .then(clientsitems => {
          setClientList(clientsitems)
        })
    }, [clientValue.title])
    
  // onDragStart fires when an element
  // starts being dragged
  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
    
    setDragAndDrop({
    ...dragAndDrop,
    draggedFrom: initialPosition,
    isDragging: true,
    originalOrder: list
    });
     
     
    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    event.dataTransfer.setData("text/html", '');
  }
  
  // onDragOver fires when an element being dragged
  // enters a droppable area.
  // In this case, any of the items on the list
  const onDragOver = (event) => {
    
    // in order for the onDrop
    // event to fire, we have
    // to cancel out this one
    event.preventDefault();
     
    let newList = dragAndDrop.originalOrder;
  
    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom; 
  
    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position); 
  
    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter((item, index) => index !== draggedFrom);
   
      newList = [
       ...remainingItems.slice(0, draggedTo),
       itemDragged,
       ...remainingItems.slice(draggedTo)
      ];
       
     if (draggedTo !== dragAndDrop.draggedTo){
      setDragAndDrop({
       ...dragAndDrop,
       updatedOrder: newList,
       draggedTo: draggedTo
      })
     }
   
  }
    
  const onDrop = (event) => {
    
    setList(dragAndDrop.updatedOrder);
    
    setDragAndDrop({
    ...dragAndDrop,
    draggedFrom: null,
    draggedTo: null,
    isDragging: false
    });
  }
   
  const onDragLeave = () => {
    setDragAndDrop({
    ...dragAndDrop,
    draggedTo: null
    });
    
  }

  const deleteItemOffer = (index, e) => {
    // Удаляем элемент в список товаров/услуг
    e.preventDefault();

    let prepareToDeleteList = list;
    delete prepareToDeleteList[index]
    setList(prepareToDeleteList);
    localStorage.setItem("items", JSON.stringify(list));

    setDragAndDrop({
      ...dragAndDrop,
      updatedOrder: prepareToDeleteList,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });
  }

  const handlePlusItem = (e) => {
    // Добавляем элемент в список товаров/услуг
    e.preventDefault();

    let prepareToAddList = list;
    prepareToAddList.push({
      id: itemValue.id,
      title: itemValue.title,
      item_price_retail: itemValue.price_retail,
      item_price_purchase: itemValue.price_retail,
      amount: "1",
      description: itemValue.description ,
      image: itemValue.image
    })
    setList(prepareToAddList);
    localStorage.setItem("items", JSON.stringify(list));

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });
  }

  // Подсчет итого
  const calculateFinalPrice = () => {
    let temp_final = 0
    list.map((item, index) => {
      temp_final += item.purchase_price
    })
    setFinallyPrice(temp_final)
  }

  const handleChangeValue = (index, key, e) => {
    // Меняем в словаре значение
    e.preventDefault();

    let prepareToChangeList = list;
    prepareToChangeList[index][key] = e.target.value
    setList(prepareToChangeList);
    
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });

    calculateFinalPrice();
  }

  // Заполнение параметров товара при добавлении
  const handleItemAutofill = ({ id, title, price_retail, image, description}) => {
    setItemValue({
      id,
      title,
      price_retail,
      image,
      description
    })
  }

  // Заполнение параметров клиента при добавлении
  const handleClientAutofill = ({ id, title}) => {
    setClientValue({
      id,
      title
    })
  }

  const handleChangeName = (e) => {
    // Устанавливаем имя категории на событии onChange
    e.preventDefault();
    setName(e.target.value);
  }

  function handlePostCLiсk(e) {
    // Обработать клик
    e.preventDefault();

    const data = {
      title: nameArea,
      client: clientValue.id,
      status_type: 'in_edit',
      items_for_offer: list
    }
    if (id === undefined) {
      // Если из состояния не пришел id, отправляем POST запрос
      offer_api.createOffer(data)
      return navigate("/profile/offer/list")
    } else {
      // Иначе PATCH
      data.cat_id = id
      offer_api.createOffer(data)
      return navigate("/profile/offer/list")
    }
  }

  return (
      <form>
          <div className="form">
            <input type="header" defaultValue={name_offer} className="form-control my-3" id="offerName" placeholder="Название КП *" onChange={(e) => handleChangeName(e)} /> 
          </div>
          <div className="form">
              <span className='ps-2'>Добавить клиента:</span>
              <input className="form-control my-3" id="clientName" placeholder="Клиент. Начните вводить текст для поиска" 
                onChange={e => {
                  const valueForClient = e.target.value
                  setClientValue({
                    title: valueForClient
                  })
                }}
              onFocus={_ => {
                setShowClients(true)
              }}
              value={clientValue.title} />

              {showClients && clientList.length > 0 && <ClientsSearch
                clients={clientList}
                onClick={({ id, title }) => {
                  handleClientAutofill({ id, title })
                  setClientList([])
                  setShowClients(false)
              }} />
              }
          </div>
          <div>
            <div>
              <span className='ps-2'>Добавить товар/ услугу:</span>
              <input className="form-control my-3" id="offerName" placeholder="Товар/ услуга. Начните вводить текст для поиска" 
                onChange={e => {
                  const valueForItem = e.target.value
                  setItemValue({
                    title: valueForItem
                  })
                }}
              onFocus={_ => {
                setShowItems(true)
              }}
              value={itemValue.title} /> 

              {showItems && itemList.length > 0 && <ItemSearch
                items={itemList}
                onClick={({ id, title, price_retail, image, description }) => {
                  handleItemAutofill({ id, title, price_retail, image, description })
                  setItemList([])
                  setShowItems(false)
              }} />
              }

              {itemValue.id && 
                <button onClick={(e) => handlePlusItem(e)}><PlusIco fill="green" transform='scale(1)' baseProfile='tiny' width={24}/></button>
              }

            </div>
           <section className='itemsforoffer'>

              <table className='table table-striped table-sm offer'>
                <thead>
                  <tr>
                    <th class="col-1">Позиция</th>
                    <th class="col-4">Название</th>
                    <th class="col-1">Цена</th>
                    <th class="col-1">Закупочная цена</th>
                    <th class="col-1">Кол-во</th>
                    <th class="col-1">Сумма</th>
                    <th scope="col">Изображение</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
              {list.map((item, index) => {
                return(
                <tr 
                    key={index}
                    data-position={index}
                    draggable
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onDragLeave={onDragLeave}
                    className={dragAndDrop && dragAndDrop.draggedTo=== Number(index) ? "dropArea" : ""}
                  >
                  <td>{index+1}:</td>
                  <td class="col-4">{item.title}</td>
                  <td class="col-1"><input value={item.item_price_retail} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'item_price_retail', e)} /></td>
                  <td class="col-1"><input value={item.item_price_purchase} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'item_price_purchase', e)} /></td>
                  <td><input value={item.amount} className="form-control my-3" id={index+1} placeholder="Цена*" onChange={(e) => handleChangeValue(index, 'amount', e)} /></td>
                  <td>{item.item_price_retail * item.amount}</td>
                  <td><img src={item.image} height="100"></img></td>
                  <td className="col-1"><button onClick={(e) => deleteItemOffer(index, e)}><DeleteIco fill="red"/></button></td>
                  <i class="fas fa-arrows-alt-v"></i>
                </tr>
                )
              })}
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>Итого:</b></td>
                <td><b></b></td>
                <td></td>
                <td></td>
              </table>
              
           </section>
           </div>
           
          <button onClick={(e) => handlePostCLiсk(e)} className="w-50 btn btn-medium btn-primary mt-3">Опубликовать</button>
      </form>
  );
};

export default OfferForm;