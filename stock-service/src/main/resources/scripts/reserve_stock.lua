-- Reserve stock for an order
-- KEYS[1] = stock key (stock:{productId}:{sizeId})
-- KEYS[2] = reserve key (reserve:{orderId}:{productId}:{sizeId})
-- ARGV[1] = quantity to reserve
-- ARGV[2] = TTL in seconds (900 = 15 minutes)
-- Returns: 1 = success, 0 = insufficient stock, -1 = stock key not found

local stockKey = KEYS[1]
local reserveKey = KEYS[2]
local quantity = tonumber(ARGV[1])
local ttl = tonumber(ARGV[2])

-- Check if stock key exists
local stock = redis.call('GET', stockKey)

-- In Lua, nil check should be: stock == nil or stock == false
if not stock then
    return -1  -- Stock key not found (need to warm up cache)
end

-- Convert stock to number
local stockNum = tonumber(stock)

-- Check if conversion was successful
if not stockNum then
    return -1  -- Invalid stock value
end

-- Check if enough stock
if stockNum < quantity then
    return 0  -- Insufficient stock
end

-- Atomic: Decrease stock + Create reservation
redis.call('DECRBY', stockKey, quantity)
redis.call('SETEX', reserveKey, ttl, quantity)

return 1  -- Success
