import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { ShopnList } from '../imports/api/shopnList.js'
import './main.html';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  var x = xhr.getResponseHeader('Content-Type')
  console.log(x);

  if ("withCredentials" in xhr){
      xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined"){
      xhr = new XDomainRequest();
      xhr.open(method, url);
  } else {
      xhr = null;
  }
  return xhr;
}


Template.body.events({
  'click #addItem': function (event){

    var m = document.querySelectorAll('.modal')
    var inst = M.Modal.init(m);

    inst[0].open();

  },
  'submit .newItem': function(event){
    event.preventDefault();
    const target = event.target;
    const n = target.iName.value;



    //var request = createCORSRequest("GET", "https://www.heb.com/");

    //request.send();
    //request.onreadystatechange = function(){
    /*
    if(this.readyState== this.HEADERS_RECEIVED){
        print(this.getAllResponseHeaders());
      }
    }
    if(request)
    {
      request.onload = function(data) {
        console.log(data);
      };

      request.onerror = function(event)
      {
        console.log(event);
      }
    }
    //request.onreadystatechange = handler;
    request.send();
*/

    const p = target.iPrice.value;

    m = document.querySelectorAll('.modal');
    var inst = M.Modal.init(m);
    var item = {"name":n,"price":p}

    console.log("Item: ", item)
    ShopnList.insert({
      item,
      createdAt: new Date(),
    });

    target.iName.value = "";
    target.iPrice.value = "";
    inst[0].close();

  },
  'click #closeDialog': function(event){
    event.preventDefault();
    var m = document.querySelectorAll('.modal');
    var inst = M.Modal.init(m);
    inst[0].close();
  },
  'click .itemContainer':function(event){
    console.log(event.target.id);

    targetId= event.target.id;
    ShopnList.remove({'_id':targetId});
  },

  'click .card':function(event){

    console.log($(event.target));
        if($(event.currentTarget).hasClass("cardPickedColor"))
        {
            $(event.currentTarget).addClass('cardColor');
            $(event.currentTarget).removeClass('cardPickedColor')
        }
        else{
            $(event.currentTarget).removeClass('cardColor');
            $(event.currentTarget).addClass('cardPickedColor')
        }
  }

})




Template.list.helpers({
  items() {
    return ShopnList.find({}, {sort: {createdAt: -1}});
  },
  totalPrice(){
    var items = ShopnList.find({});

    var total = 0.0;
    const list = items.fetch();

    for(var i =0; i<list.length;i++)
    {
      total += Number(list[i].item.price);
    }

    return total;
  },
  newId()
  {
    return makeid();
  },
});
