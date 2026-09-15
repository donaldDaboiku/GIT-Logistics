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

    public function isTerminal(): bool
    {
        return in_array($this, [self::Delivered, self::Returned, self::Cancelled], true);
    }

    /**
     * Allowed next statuses from this status.
     *
     * @return list<self>
     */
    public function allowedNext(): array
    {
        return match ($this) {
            self::OrderCreated => [self::PickedUp, self::Cancelled],
            self::PickedUp => [self::AtOriginHub, self::InTransit, self::Cancelled],
            self::AtOriginHub => [self::InTransit, self::Cancelled],
            self::InTransit => [self::AtDestinationHub, self::OutForDelivery],
            self::AtDestinationHub => [self::OutForDelivery, self::Returned],
            self::OutForDelivery => [self::Delivered, self::DeliveryAttempted, self::Returned],
            self::DeliveryAttempted => [self::OutForDelivery, self::Delivered, self::Returned],
            self::Delivered, self::Returned, self::Cancelled => [],
        };
    }

    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->allowedNext(), true);
    }

    /** @return list<string> */
    public function allowedNextValues(): array
    {
        return array_map(fn (self $status) => $status->value, $this->allowedNext());
    }
}
