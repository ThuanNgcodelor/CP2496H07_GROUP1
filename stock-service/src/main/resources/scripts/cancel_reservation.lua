-- Cancel reservation and rollback stock
-- KEYS[1] = stock key (stock:{productId}:{sizeId})
-- KEYS[2] = reserve key (reserve:{orderId}:{productId}:{sizeId})
-- Returns: quantity rolled back, or 0 if reservation doesn't exist

local stockKey = KEYS[1]
local reserveKey = KEYS[2]

-- Get reserved quantity
local reserved = redis.call('GET', reserveKey)

-- In Lua, nil check should use: not reserved
if not reserved then
    return 0  -- Reservation doesn't exist (already confirmed/expired)
end

-- Convert to number
local reservedNum = tonumber(reserved)
if not reservedNum then
    return 0  -- Invalid value
end

-- Atomic: Rollback stock + Delete reservation
redis.call('INCRBY', stockKey, reservedNum)
redis.call('DEL', reserveKey)

return reservedNum
