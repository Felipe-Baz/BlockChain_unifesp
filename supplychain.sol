// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract SupplyChain { 
    address public owner;

    enum SupplyChainState { 
        Created, 
        Paid, 
        Delivered,
        Received
    }

    struct Order { 
        string productName; 
        uint256 amount; 
        uint256 price; 
        address buyer; 
        address seller; 
        SupplyChainState state; 
    } 

    mapping (uint256 => Order) public orders;

    uint256 public orderCounter; 

    event OrderCreated(uint256 orderID); 
    event OrderPaid(uint256 orderID); 
    event OrderDelivered(uint256 orderID); 
    event OrderConfirmReceive(uint256 orderID);
    event QuantityUpdated(uint256 orderID, uint256 newAmount);

    constructor() { 
        owner = msg.sender; 
    }

    function createOrder(string memory _productName, uint256 _amount, uint256 _price) public { 
        require(msg.sender != address(0), "Invalid address"); 
        orderCounter++; 
        orders[orderCounter] = Order(_productName, _amount, _price, msg.sender, address(0), SupplyChainState.Created); 
        emit OrderCreated(orderCounter); 
    } 

    function payForOrder(uint256 _orderID) public payable { 
        require(msg.sender != address(0), "Invalid address"); 
        require(msg.value == orders[_orderID].price, "Invalid payment amount"); 
        require(orders[_orderID].state == SupplyChainState.Created, "Invalid order state"); 
        orders[_orderID].seller = msg.sender; 
        orders[_orderID].state = SupplyChainState.Paid; 
        payable(owner).transfer(msg.value); 
        emit OrderPaid(_orderID); 
    }

    function deliverOrder(uint256 _orderID) public { 
        require(msg.sender != address(0), "Invalid address"); 
        require(msg.sender == orders[_orderID].buyer || msg.sender == orders[_orderID].seller, "Unauthorized user"); 
        require(orders[_orderID].state == SupplyChainState.Paid, "Invalid order state"); 
        orders[_orderID].state = SupplyChainState.Delivered; 
        emit OrderDelivered(_orderID); 
    }

    function confirmReceiveOrder(uint256 _orderID) public { 
        require(msg.sender != address(0), "Invalid address"); 
        require(msg.sender == orders[_orderID].buyer || msg.sender == orders[_orderID].seller, "Unauthorized user"); 
        require(orders[_orderID].state == SupplyChainState.Delivered, "Invalid order state"); 
        orders[_orderID].state = SupplyChainState.Received; 
        emit OrderConfirmReceive(_orderID); 
    }

    function updateQuantity(uint256 _orderID, uint256 _newAmount) public {
        require(orders[_orderID].state == SupplyChainState.Created, "Invalid order state");
        orders[_orderID].amount = _newAmount;
        emit QuantityUpdated(_orderID, _newAmount);
    }
}
