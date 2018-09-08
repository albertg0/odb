import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { ShopnList } from '../imports/api/shopnList.js'
import './main.html';

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


Template.body.events({
  'click #addItem': function (event){

    var dialog = document.querySelector('dialog');
    dialog.show();
  
  },
  'submit .newItem': function(event){
    event.preventDefault();
    const target = event.target;
    const n = target.iName.value;
    const p = target.iPrice.value;
    
    dialog = document.querySelector('dialog');
    var item = {"name":n,"price":p}

    console.log("Item: ", item)
    ShopnList.insert({
      item,
      createdAt: new Date(),
    });

    target.iName.value = "";
    target.iPrice.value = "";
    dialog.close(); 

  },
  'click #closeDialog': function(event){
    var dialog = document.querySelector('dialog');
    dialog.close();
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
