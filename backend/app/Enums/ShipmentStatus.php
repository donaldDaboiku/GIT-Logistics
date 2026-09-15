<?php

namespace App\Enums;

enum ShipmentStatus: string
{
    case OrderCreated = 'ORDER_CREATED';
    case PickedUp = 'PICKED_UP';
    case AtOriginHub = 'AT_ORIGIN_HUB';
    case InTransit = 'IN_TRANSIT';
    case AtDestinationHub = 'AT_DESTINATION_HUB';
    case OutForDelivery = 'OUT_FOR_DELIVERY';
    case Delivered = 'DELIVERED';
    case DeliveryAttempted = 'DELIVERY_ATTEMPTED';
    case Returned = 'RETURNED';
    case Cancelled = 'CANCELLED';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
