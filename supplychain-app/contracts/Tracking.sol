// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Tracking { 
    enum ShipmentStatus { 
        PENDING, 
        IN_TRANSIT,
        DELIVERED
    }

    struct Shipment { 
        address sender; 
        address receiver; 
        uint256 pickupTime; 
        uint256 deliveryTime; 
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    } 

    mapping(address => Shipment[]) public shipments;
    uint256 public shipmentCount;

    struct TypeShipment {
        address sender; 
        address receiver;
        uint256 pickupTime; 
        uint256 deliveryTime; 
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    TypeShipment[] typeShipments;

    event ShipmentCreated (
        address indexed sender, 
        address indexed receiver, 
        uint256 pickupTime,
        uint256 distance,
        uint256 price
    );

    event ShipmentInTransit (
        address indexed sender, 
        address indexed receiver, 
        uint256 pickupTime
    );

    event ShipmentDelivered (
        address indexed sender, 
        address indexed receiver, 
        uint256 deliveryTime
    );

    event ShipmentPaid (
        address indexed sender, 
        address indexed receiver, 
        uint256 amount
    );

    constructor() {
        shipmentCount = 0;
    }

    function createShipment(address _receiver, uint256 _pickupTime, uint256 _distance, uint256 _price) public payable {
        require(msg.value == _price, "O pagamento deve ser igual ao valor do pedido.");

        Shipment memory shipment = Shipment(
            msg.sender, 
            _receiver, 
            _pickupTime, 
            0, 
            _distance, 
            _price, 
            ShipmentStatus.PENDING, 
            false
        );

        shipments[msg.sender].push(shipment);
        shipmentCount++;

        typeShipments.push(
            TypeShipment(
                msg.sender,
                _receiver,
                _pickupTime, 
                0, 
                _distance, 
                _price, 
                ShipmentStatus.PENDING, 
                false
            )
        );

        emit ShipmentCreated(msg.sender, _receiver, _pickupTime, _distance, _price);
    }

    function startShipment(address _sender, address _receiver, uint256 _index) public  {
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage  typeShipment = typeShipments[_index];
        require(shipment.receiver == _receiver, "Receiver invalido.");
        require(shipment.status == ShipmentStatus.PENDING, "O pedido ja esta em transito.");

        shipment.status = ShipmentStatus.IN_TRANSIT;
        typeShipment.status = ShipmentStatus.IN_TRANSIT;

        emit ShipmentDelivered(_sender, _receiver, shipment.pickupTime);
    }

    function completeShipment(address _sender, address _receiver, uint256 _index) public {
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage typeShipment = typeShipments[_index];

        require(shipment.receiver == _receiver, "Invalid Receiver.");
        require(shipment.status == ShipmentStatus.IN_TRANSIT, "O Pedido nao esta em transito.");
        require(!shipment.isPaid, "O Pedido ja foi pago.");

        shipment.status = ShipmentStatus.DELIVERED;
        typeShipment.status = ShipmentStatus.DELIVERED;

        typeShipment.deliveryTime = block.timestamp;

        uint256 amount = shipment.price;

        payable(shipment.sender).transfer(amount);

        shipment.isPaid = true;
        typeShipment.isPaid = true;

        emit ShipmentDelivered(_sender, _receiver, shipment.deliveryTime);
        emit ShipmentPaid(_sender, _receiver, amount);
    }

    function getShipment(address _sender, uint256 _index) public view returns (address, address, uint256, uint256, uint256, uint256, ShipmentStatus, bool) {
        Shipment memory shipment = shipments[_sender][_index];
        return (shipment.sender, shipment.receiver, shipment.pickupTime, shipment.deliveryTime, shipment.distance, shipment.price, shipment.status, shipment.isPaid);
    }

    function getShipmentCount(address _sender) public view returns (uint256) {
        return shipments[_sender].length;
    }

    function getAllTransactions ()
        public 
        view 
        returns (TypeShipment[] memory)
    {
        return typeShipments;
    }
}