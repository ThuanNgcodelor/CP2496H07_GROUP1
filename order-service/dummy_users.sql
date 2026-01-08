-- Bulk insert 100 users and addresses for Load Test
USE shopee;

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '1e273ab7-1b7e-4ccb-acdb-c902bf23faec',
        'ACTIVE',
        'thuannguyen1@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen1'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '639b534f-d541-4f5e-9497-5bb54d8cf636',
        '1e273ab7-1b7e-4ccb-acdb-c902bf23faec',
        'Nhà Riêng',
        'User 1',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 1',
        1
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '18a00393-eccf-46ba-95cb-0909b634c9f2',
        'ACTIVE',
        'thuannguyen2@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen2'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'f33064ac-6960-49d5-bb01-8bbcfc7a2f02',
        '18a00393-eccf-46ba-95cb-0909b634c9f2',
        'Nhà Riêng',
        'User 2',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 2',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'f6b5a166-92f2-4d29-9194-1fcb0997ac82',
        'ACTIVE',
        'thuannguyen3@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen3'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '7f5a5920-47a4-4a6c-b986-d60bb37d37cf',
        'f6b5a166-92f2-4d29-9194-1fcb0997ac82',
        'Nhà Riêng',
        'User 3',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 3',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'bf2de9f1-ef1b-49bf-9924-98350747cb16',
        'ACTIVE',
        'thuannguyen4@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen4'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '2c01df35-5cba-42e9-9d83-ab6470fcc2d7',
        'bf2de9f1-ef1b-49bf-9924-98350747cb16',
        'Nhà Riêng',
        'User 4',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 4',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '8c255bd0-3a76-410d-b6c9-d6e97ae22852',
        'ACTIVE',
        'thuannguyen5@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen5'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '1b3a6925-7900-43cb-b723-395020796835',
        '8c255bd0-3a76-410d-b6c9-d6e97ae22852',
        'Nhà Riêng',
        'User 5',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 5',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '0f6de490-2240-4ff6-965f-4297cef717b1',
        'ACTIVE',
        'thuannguyen6@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen6'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'b19d3ed6-9730-4bff-a06a-4eb3072ff75c',
        '0f6de490-2240-4ff6-965f-4297cef717b1',
        'Nhà Riêng',
        'User 6',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 6',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'cf2b2aaa-2897-4a92-ae3b-a94909c3cf8e',
        'ACTIVE',
        'thuannguyen7@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen7'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'd45542de-1c18-4138-90d6-84a0e5c0b540',
        'cf2b2aaa-2897-4a92-ae3b-a94909c3cf8e',
        'Nhà Riêng',
        'User 7',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 7',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '031e2138-67c2-4626-b68b-16ec1add8ee6',
        'ACTIVE',
        'thuannguyen8@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen8'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '1c3fb46a-ea62-4520-9d3e-193fcbb3e844',
        '031e2138-67c2-4626-b68b-16ec1add8ee6',
        'Nhà Riêng',
        'User 8',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 8',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '3b4a7e77-0400-47e5-bf10-b86087639f5b',
        'ACTIVE',
        'thuannguyen9@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen9'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '3057a035-62cf-41a2-8299-563cac11fd79',
        '3b4a7e77-0400-47e5-bf10-b86087639f5b',
        'Nhà Riêng',
        'User 9',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 9',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '641227a0-a04d-49b5-92ff-488b4b5186de',
        'ACTIVE',
        'thuannguyen10@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen10'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '323e0f2c-f36b-4d85-b473-cf7570a89e10',
        '641227a0-a04d-49b5-92ff-488b4b5186de',
        'Nhà Riêng',
        'User 10',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 10',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '8af92796-48e3-4b6c-a9e0-4d4d48f93fa8',
        'ACTIVE',
        'thuannguyen11@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen11'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '204c1ae9-4a42-4a88-b681-ef810ee07de7',
        '8af92796-48e3-4b6c-a9e0-4d4d48f93fa8',
        'Nhà Riêng',
        'User 11',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 11',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '1cd6df38-4a8a-4a8b-985e-6893294a3202',
        'ACTIVE',
        'thuannguyen12@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen12'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '3ec8ae75-86c5-44ee-ab3b-fe84fd63b78a',
        '1cd6df38-4a8a-4a8b-985e-6893294a3202',
        'Nhà Riêng',
        'User 12',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 12',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '85960ab8-d25a-4704-b2a1-cc87693554d1',
        'ACTIVE',
        'thuannguyen13@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen13'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '8d2eeeb5-ae70-4325-a27a-856908c8acbf',
        '85960ab8-d25a-4704-b2a1-cc87693554d1',
        'Nhà Riêng',
        'User 13',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 13',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '7f0c5715-0ca6-4a95-947e-3ae40ca3a022',
        'ACTIVE',
        'thuannguyen14@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen14'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'c61eec61-0631-45d8-91f0-25f102c10246',
        '7f0c5715-0ca6-4a95-947e-3ae40ca3a022',
        'Nhà Riêng',
        'User 14',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 14',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'bf53c0ad-8d74-431b-8661-8c791504f099',
        'ACTIVE',
        'thuannguyen15@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen15'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '2fa26285-a305-43bc-90c5-37646603119e',
        'bf53c0ad-8d74-431b-8661-8c791504f099',
        'Nhà Riêng',
        'User 15',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 15',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '0b584d20-86cf-43d9-b4d0-272bbf68eb56',
        'ACTIVE',
        'thuannguyen16@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen16'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'c6041c12-9af3-49da-ad75-fb79e6d963fc',
        '0b584d20-86cf-43d9-b4d0-272bbf68eb56',
        'Nhà Riêng',
        'User 16',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 16',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'ba3cd644-0d52-46e1-9df3-bef2d5b7f0d4',
        'ACTIVE',
        'thuannguyen17@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen17'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '0432900d-c629-40a9-8e7b-f7828489a605',
        'ba3cd644-0d52-46e1-9df3-bef2d5b7f0d4',
        'Nhà Riêng',
        'User 17',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 17',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '38d77ba1-8ef5-49c9-9838-fd64cc94190f',
        'ACTIVE',
        'thuannguyen18@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen18'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'f30c2305-f746-4b99-87ce-1eac99cd42d9',
        '38d77ba1-8ef5-49c9-9838-fd64cc94190f',
        'Nhà Riêng',
        'User 18',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 18',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'f73184bc-19d2-461c-9a21-d26a7e8871b1',
        'ACTIVE',
        'thuannguyen19@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen19'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '524b99b0-4a3a-4931-a607-d29cd815f30f',
        'f73184bc-19d2-461c-9a21-d26a7e8871b1',
        'Nhà Riêng',
        'User 19',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 19',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '3d6b2f4b-acee-46a4-ada4-fc87c230260a',
        'ACTIVE',
        'thuannguyen20@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen20'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '66b65ab8-d307-4eed-a12d-2a1b784f6055',
        '3d6b2f4b-acee-46a4-ada4-fc87c230260a',
        'Nhà Riêng',
        'User 20',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 20',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'dda0daaf-fab4-4bf3-8e74-6e6a3b1ee782',
        'ACTIVE',
        'thuannguyen21@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen21'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '23fe0172-66ed-40a8-98a3-fb29cfc9bfb9',
        'dda0daaf-fab4-4bf3-8e74-6e6a3b1ee782',
        'Nhà Riêng',
        'User 21',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 21',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'ae939779-30b1-4785-b7fa-88b9d0947430',
        'ACTIVE',
        'thuannguyen22@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen22'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '5e5f712e-b44b-4f40-b538-61c73969b2a6',
        'ae939779-30b1-4785-b7fa-88b9d0947430',
        'Nhà Riêng',
        'User 22',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 22',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'a432dbc9-0d50-484e-b8b6-7f4df49f31e2',
        'ACTIVE',
        'thuannguyen23@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen23'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'd11c5f97-1427-4aeb-a148-fa4621122515',
        'a432dbc9-0d50-484e-b8b6-7f4df49f31e2',
        'Nhà Riêng',
        'User 23',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 23',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '2356a9f4-f0bb-4654-9939-da7da5982746',
        'ACTIVE',
        'thuannguyen24@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen24'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'bf45b501-f9f0-41f6-92fa-5f0c6fbb95d2',
        '2356a9f4-f0bb-4654-9939-da7da5982746',
        'Nhà Riêng',
        'User 24',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 24',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '718a290a-ab07-40ec-ba08-5bf2141e816c',
        'ACTIVE',
        'thuannguyen25@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen25'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '22312cdf-7750-484d-be35-030fc63c7690',
        '718a290a-ab07-40ec-ba08-5bf2141e816c',
        'Nhà Riêng',
        'User 25',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 25',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '44369e07-2128-4733-9861-9cda6898643d',
        'ACTIVE',
        'thuannguyen26@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen26'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '58633946-7330-4366-be90-5509aa30f04c',
        '44369e07-2128-4733-9861-9cda6898643d',
        'Nhà Riêng',
        'User 26',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 26',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '66d55445-e477-46a6-9a44-5cacb5a6bd13',
        'ACTIVE',
        'thuannguyen27@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen27'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'b6167398-20ed-41f0-8bc8-48a4a0fbb8d0',
        '66d55445-e477-46a6-9a44-5cacb5a6bd13',
        'Nhà Riêng',
        'User 27',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 27',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'd5d40ecf-882b-4e81-a674-8efc0db455a4',
        'ACTIVE',
        'thuannguyen28@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen28'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '50e7bfd9-0f87-4bed-b170-2b22f0aa8a85',
        'd5d40ecf-882b-4e81-a674-8efc0db455a4',
        'Nhà Riêng',
        'User 28',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 28',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'aa2c59d5-cfa2-4f24-a8a3-2293e4fd48dc',
        'ACTIVE',
        'thuannguyen29@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen29'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'cf4ca5fd-6288-4829-be47-c5572a2831b9',
        'aa2c59d5-cfa2-4f24-a8a3-2293e4fd48dc',
        'Nhà Riêng',
        'User 29',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 29',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'aa31cd9e-75f6-4d0a-9cbb-33193f65687e',
        'ACTIVE',
        'thuannguyen30@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen30'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'abebff82-6f21-479e-adb2-b779e62691da',
        'aa31cd9e-75f6-4d0a-9cbb-33193f65687e',
        'Nhà Riêng',
        'User 30',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 30',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '5ae9bc9d-acb8-41c2-8e53-42c4042b807d',
        'ACTIVE',
        'thuannguyen31@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen31'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '6894ea7d-b88b-4fea-b647-fb23d7337ec7',
        '5ae9bc9d-acb8-41c2-8e53-42c4042b807d',
        'Nhà Riêng',
        'User 31',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 31',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '885c1a49-b8a5-44af-925b-d3aa98903b51',
        'ACTIVE',
        'thuannguyen32@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen32'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '253cec80-dc9b-413d-9ea5-a426db389884',
        '885c1a49-b8a5-44af-925b-d3aa98903b51',
        'Nhà Riêng',
        'User 32',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 32',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '24a302aa-c55f-4310-8af0-1af8d55a65b0',
        'ACTIVE',
        'thuannguyen33@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen33'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '1be2c21e-c012-4a97-958a-65a0efdb5b98',
        '24a302aa-c55f-4310-8af0-1af8d55a65b0',
        'Nhà Riêng',
        'User 33',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 33',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'a719c1e6-28ee-4933-959d-988ca46a06f8',
        'ACTIVE',
        'thuannguyen34@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen34'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '330db2f1-8e5a-4f3a-aad3-8403ab25973b',
        'a719c1e6-28ee-4933-959d-988ca46a06f8',
        'Nhà Riêng',
        'User 34',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 34',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'ab80710b-8a38-4afe-8b00-8d5cb11edbd3',
        'ACTIVE',
        'thuannguyen35@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen35'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '9725c1e8-7d27-4074-a818-cf55956f95a3',
        'ab80710b-8a38-4afe-8b00-8d5cb11edbd3',
        'Nhà Riêng',
        'User 35',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 35',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '7f48e305-a2fd-4c33-8166-e6c046c94e9d',
        'ACTIVE',
        'thuannguyen36@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen36'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '05d4d73e-e0f0-49ee-bc26-c14b004ab4c8',
        '7f48e305-a2fd-4c33-8166-e6c046c94e9d',
        'Nhà Riêng',
        'User 36',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 36',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '4a7c6b41-dd48-4557-9dcd-651934c5b34e',
        'ACTIVE',
        'thuannguyen37@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen37'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '16b318c8-efaf-4d66-a509-ce300d02f7b3',
        '4a7c6b41-dd48-4557-9dcd-651934c5b34e',
        'Nhà Riêng',
        'User 37',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 37',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'ffed5565-7965-458c-a53e-9d887fa2acf6',
        'ACTIVE',
        'thuannguyen38@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen38'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '4c20b948-03e0-4c1c-a7d3-980946923b07',
        'ffed5565-7965-458c-a53e-9d887fa2acf6',
        'Nhà Riêng',
        'User 38',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 38',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'af0e7855-81c5-4304-9b03-e33036bd7256',
        'ACTIVE',
        'thuannguyen39@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen39'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'a0c3d1ef-4308-44f7-8598-70854cb473f0',
        'af0e7855-81c5-4304-9b03-e33036bd7256',
        'Nhà Riêng',
        'User 39',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 39',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'd9951128-f5e9-447d-a6cd-24db21d0d329',
        'ACTIVE',
        'thuannguyen40@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen40'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '4a6d1fea-0a85-4f68-9a8b-c50c6379cf10',
        'd9951128-f5e9-447d-a6cd-24db21d0d329',
        'Nhà Riêng',
        'User 40',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 40',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'ef8841bd-ffbc-4126-9945-fcbf9d0ea5b2',
        'ACTIVE',
        'thuannguyen41@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen41'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '21844c04-790b-44d4-b068-02af20129401',
        'ef8841bd-ffbc-4126-9945-fcbf9d0ea5b2',
        'Nhà Riêng',
        'User 41',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 41',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '1addb95c-bf63-46f6-9e8c-4c79c2f7dbe5',
        'ACTIVE',
        'thuannguyen42@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen42'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'bc57d44d-909c-4ee6-93f6-57f85a19cfd9',
        '1addb95c-bf63-46f6-9e8c-4c79c2f7dbe5',
        'Nhà Riêng',
        'User 42',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 42',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '1b1946a8-288b-43aa-9c07-3914f4384fee',
        'ACTIVE',
        'thuannguyen43@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen43'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '54a2dee2-0b10-4871-80a5-b94ef2277887',
        '1b1946a8-288b-43aa-9c07-3914f4384fee',
        'Nhà Riêng',
        'User 43',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 43',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'debdc761-7f19-4d26-87ad-42a956f11ef1',
        'ACTIVE',
        'thuannguyen44@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen44'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '3d485867-4c7b-43cb-847b-69639906b385',
        'debdc761-7f19-4d26-87ad-42a956f11ef1',
        'Nhà Riêng',
        'User 44',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 44',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'fcfa2dd3-2f14-4eda-94e3-525026014d59',
        'ACTIVE',
        'thuannguyen45@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen45'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '54fcd753-7090-4bae-a000-b597c4fd822a',
        'fcfa2dd3-2f14-4eda-94e3-525026014d59',
        'Nhà Riêng',
        'User 45',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 45',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'd55fdb6a-de37-4a77-ae22-c24622e46cc5',
        'ACTIVE',
        'thuannguyen46@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen46'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'b572e4ad-9246-4408-b159-4b5121e551d6',
        'd55fdb6a-de37-4a77-ae22-c24622e46cc5',
        'Nhà Riêng',
        'User 46',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 46',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'a42bd41a-1f9b-46bd-b6dc-9e3308013bbb',
        'ACTIVE',
        'thuannguyen47@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen47'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '46e2da00-74b6-466d-a7da-06cdcde97dfe',
        'a42bd41a-1f9b-46bd-b6dc-9e3308013bbb',
        'Nhà Riêng',
        'User 47',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 47',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '8a29c0ac-60c6-484c-b4c2-6ce93978235c',
        'ACTIVE',
        'thuannguyen48@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen48'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '9fd57445-5283-4a70-a86f-6e7c8977bcb7',
        '8a29c0ac-60c6-484c-b4c2-6ce93978235c',
        'Nhà Riêng',
        'User 48',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 48',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '003715f2-7b6f-4f69-adac-99405ba50bc4',
        'ACTIVE',
        'thuannguyen49@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen49'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'dac28cae-63a2-45fe-aeee-518d08663bd4',
        '003715f2-7b6f-4f69-adac-99405ba50bc4',
        'Nhà Riêng',
        'User 49',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 49',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'e55c0900-b8fa-4e4a-a725-364c80126e8d',
        'ACTIVE',
        'thuannguyen50@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen50'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '435bf45a-f225-436f-b8bd-1796fdf79695',
        'e55c0900-b8fa-4e4a-a725-364c80126e8d',
        'Nhà Riêng',
        'User 50',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 50',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '76376835-457f-4f90-8568-49636d686b4b',
        'ACTIVE',
        'thuannguyen51@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen51'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '870c3e9d-2043-4cab-8528-07eff9e4706e',
        '76376835-457f-4f90-8568-49636d686b4b',
        'Nhà Riêng',
        'User 51',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 51',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '94be7276-4a5d-452c-a4fd-bfcd0f12f4d8',
        'ACTIVE',
        'thuannguyen52@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen52'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '68a5bd21-ea08-4c17-98d6-6ccf4e9805f1',
        '94be7276-4a5d-452c-a4fd-bfcd0f12f4d8',
        'Nhà Riêng',
        'User 52',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 52',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '9873baec-102c-4d56-a8d9-ef67a37f4d65',
        'ACTIVE',
        'thuannguyen53@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen53'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '1e77bc92-1a5c-4b08-9201-7055e0827148',
        '9873baec-102c-4d56-a8d9-ef67a37f4d65',
        'Nhà Riêng',
        'User 53',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 53',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'a8790f02-9f70-41e2-b233-7f657581143a',
        'ACTIVE',
        'thuannguyen54@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen54'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '302237d5-c91e-486d-998e-2d66923de861',
        'a8790f02-9f70-41e2-b233-7f657581143a',
        'Nhà Riêng',
        'User 54',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 54',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '658fc002-f939-4e7c-bbbf-401a8364c6f7',
        'ACTIVE',
        'thuannguyen55@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen55'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '43c15bf7-6d90-4571-8435-ab425c56b196',
        '658fc002-f939-4e7c-bbbf-401a8364c6f7',
        'Nhà Riêng',
        'User 55',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 55',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '7ecccb8d-41a7-42ea-9c24-278c0940f80a',
        'ACTIVE',
        'thuannguyen56@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen56'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'e0ee99c7-e34a-4904-80a3-ce4eae417c1a',
        '7ecccb8d-41a7-42ea-9c24-278c0940f80a',
        'Nhà Riêng',
        'User 56',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 56',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'bd145fdc-a6af-47bd-86a4-9197253b019b',
        'ACTIVE',
        'thuannguyen57@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen57'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'e9dba898-5755-44e6-9f2c-83c49b344958',
        'bd145fdc-a6af-47bd-86a4-9197253b019b',
        'Nhà Riêng',
        'User 57',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 57',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'b5721bf8-1d70-4a4f-b604-90e79f0ee729',
        'ACTIVE',
        'thuannguyen58@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen58'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '01790e2a-045d-49a0-86ab-72a86063c4ee',
        'b5721bf8-1d70-4a4f-b604-90e79f0ee729',
        'Nhà Riêng',
        'User 58',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 58',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'fd56e0ff-86c5-4269-aa64-b6cfaefebb0a',
        'ACTIVE',
        'thuannguyen59@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen59'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'fc4e9325-0dfc-4068-ae82-8a00ed5ab5f3',
        'fd56e0ff-86c5-4269-aa64-b6cfaefebb0a',
        'Nhà Riêng',
        'User 59',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 59',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '6c648779-f041-410b-9600-69c7793bf339',
        'ACTIVE',
        'thuannguyen60@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen60'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '84ede2a8-0c26-4ad1-8b41-e04c58884d78',
        '6c648779-f041-410b-9600-69c7793bf339',
        'Nhà Riêng',
        'User 60',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 60',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'f5904f39-20f2-497a-8e4c-04f99ed27c79',
        'ACTIVE',
        'thuannguyen61@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen61'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '36b445f6-7680-469f-982c-2ea4cad8d4b5',
        'f5904f39-20f2-497a-8e4c-04f99ed27c79',
        'Nhà Riêng',
        'User 61',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 61',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '9c673935-77aa-43af-bb5f-0ca0ea5c569d',
        'ACTIVE',
        'thuannguyen62@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen62'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '7d8a9cb8-883d-401f-980a-9b89de2ece43',
        '9c673935-77aa-43af-bb5f-0ca0ea5c569d',
        'Nhà Riêng',
        'User 62',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 62',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '4d7e17a5-5351-4b85-b95e-0309d04188aa',
        'ACTIVE',
        'thuannguyen63@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen63'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '72663241-d2d7-4fa8-a96b-a2dbfdbee2e1',
        '4d7e17a5-5351-4b85-b95e-0309d04188aa',
        'Nhà Riêng',
        'User 63',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 63',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '33a99b84-903d-44a7-b4cf-53e1535e4ab1',
        'ACTIVE',
        'thuannguyen64@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen64'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '05cb9103-2652-4091-85b9-a52b41ed878d',
        '33a99b84-903d-44a7-b4cf-53e1535e4ab1',
        'Nhà Riêng',
        'User 64',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 64',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '735fca6c-64f8-4c0c-83e3-512584d3fe70',
        'ACTIVE',
        'thuannguyen65@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen65'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '82654998-47ab-409f-a4c9-e9f16228efab',
        '735fca6c-64f8-4c0c-83e3-512584d3fe70',
        'Nhà Riêng',
        'User 65',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 65',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '0502145f-a631-4537-9946-bcc01a213d25',
        'ACTIVE',
        'thuannguyen66@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen66'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'eb8325a7-d011-4f84-885d-3aed855fe178',
        '0502145f-a631-4537-9946-bcc01a213d25',
        'Nhà Riêng',
        'User 66',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 66',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'b499b68d-3f1b-40f9-aaed-59d0d127b448',
        'ACTIVE',
        'thuannguyen67@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen67'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '4ae5b53b-9977-4fac-b6bb-94401d742dbd',
        'b499b68d-3f1b-40f9-aaed-59d0d127b448',
        'Nhà Riêng',
        'User 67',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 67',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'c5db5a2b-1ea1-43a7-9d2d-8f24ed61c89b',
        'ACTIVE',
        'thuannguyen68@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen68'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'b7ea4c64-84cb-43de-b7a9-d56b2e028ce4',
        'c5db5a2b-1ea1-43a7-9d2d-8f24ed61c89b',
        'Nhà Riêng',
        'User 68',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 68',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'cf335d54-bc55-41cf-bacb-09e6ef447cae',
        'ACTIVE',
        'thuannguyen69@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen69'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '5ce7441d-b80c-413e-ad49-7f0c2ebde45f',
        'cf335d54-bc55-41cf-bacb-09e6ef447cae',
        'Nhà Riêng',
        'User 69',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 69',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '7287e1a8-ea33-4e24-80b1-288ed65a7c70',
        'ACTIVE',
        'thuannguyen70@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen70'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '56dff0ea-0b36-4230-8fbc-84a93b476219',
        '7287e1a8-ea33-4e24-80b1-288ed65a7c70',
        'Nhà Riêng',
        'User 70',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 70',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '4a0d68fe-9b27-4d4b-b1bc-fc00b5ca32ef',
        'ACTIVE',
        'thuannguyen71@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen71'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '2b0b6c4a-ba9f-4ab4-9056-6345aa87e2df',
        '4a0d68fe-9b27-4d4b-b1bc-fc00b5ca32ef',
        'Nhà Riêng',
        'User 71',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 71',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'd8db413c-414f-4edd-866b-5544c1917b69',
        'ACTIVE',
        'thuannguyen72@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen72'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '99089947-2ee8-4acc-9b29-610369c47877',
        'd8db413c-414f-4edd-866b-5544c1917b69',
        'Nhà Riêng',
        'User 72',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 72',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '4340c539-c913-4c79-a3ca-379b663f92f5',
        'ACTIVE',
        'thuannguyen73@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen73'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '77d6ecd3-11f4-48a7-8416-a8bb10ed6b2b',
        '4340c539-c913-4c79-a3ca-379b663f92f5',
        'Nhà Riêng',
        'User 73',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 73',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'a94cae37-db5d-4f65-887e-47335ae3234f',
        'ACTIVE',
        'thuannguyen74@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen74'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'c0235f90-2058-4354-9e42-f3933f77b683',
        'a94cae37-db5d-4f65-887e-47335ae3234f',
        'Nhà Riêng',
        'User 74',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 74',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '8df2f0cd-ca43-4fbe-97ca-ed19daafcfc1',
        'ACTIVE',
        'thuannguyen75@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen75'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'b73b2c6d-0b16-44de-a9ff-88b2366ef788',
        '8df2f0cd-ca43-4fbe-97ca-ed19daafcfc1',
        'Nhà Riêng',
        'User 75',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 75',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '89714700-9977-470a-9d4c-a2f46f94a252',
        'ACTIVE',
        'thuannguyen76@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen76'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'adf71a79-20cd-4477-bbc9-a25cdf1bf3e2',
        '89714700-9977-470a-9d4c-a2f46f94a252',
        'Nhà Riêng',
        'User 76',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 76',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '0fa8ced6-87d0-4d7b-acb5-e5d262cb5067',
        'ACTIVE',
        'thuannguyen77@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen77'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'd4ee2b32-9e6d-47c4-bc3e-812ef29f0abd',
        '0fa8ced6-87d0-4d7b-acb5-e5d262cb5067',
        'Nhà Riêng',
        'User 77',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 77',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '42aa4bbd-3e9b-44f8-8044-c9c789773656',
        'ACTIVE',
        'thuannguyen78@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen78'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '855c2c32-745c-4230-9012-4c46554f3b67',
        '42aa4bbd-3e9b-44f8-8044-c9c789773656',
        'Nhà Riêng',
        'User 78',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 78',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'a5591b4d-29af-4fe5-949b-4de49c858fa5',
        'ACTIVE',
        'thuannguyen79@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen79'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '1d334db3-2eaa-4906-af89-fdc9f80b74f7',
        'a5591b4d-29af-4fe5-949b-4de49c858fa5',
        'Nhà Riêng',
        'User 79',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 79',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'd699ec93-1389-42f8-9bd8-42c91fdc90f1',
        'ACTIVE',
        'thuannguyen80@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen80'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '895137dc-2da5-4f96-b391-bf9de3c62564',
        'd699ec93-1389-42f8-9bd8-42c91fdc90f1',
        'Nhà Riêng',
        'User 80',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 80',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '2bf7f71f-d778-47eb-a74b-acc3ca9ce11b',
        'ACTIVE',
        'thuannguyen81@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen81'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '969b7c82-c262-4e2c-aa09-3276f1ec49e6',
        '2bf7f71f-d778-47eb-a74b-acc3ca9ce11b',
        'Nhà Riêng',
        'User 81',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 81',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '8786d0ac-d150-4565-8804-6f3232962019',
        'ACTIVE',
        'thuannguyen82@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen82'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'c0d50087-a272-4d63-b011-86d95b6da67e',
        '8786d0ac-d150-4565-8804-6f3232962019',
        'Nhà Riêng',
        'User 82',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 82',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'd3df1389-e4d0-440f-a507-b0448fd0490b',
        'ACTIVE',
        'thuannguyen83@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen83'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '481aaf6d-9604-44f9-8d5f-58135cc9d155',
        'd3df1389-e4d0-440f-a507-b0448fd0490b',
        'Nhà Riêng',
        'User 83',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 83',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'c7cbf15f-9c96-4b3d-8048-e251cd4d2807',
        'ACTIVE',
        'thuannguyen84@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen84'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '2e4009be-19b0-44b1-bd48-f2f9a2d1a41e',
        'c7cbf15f-9c96-4b3d-8048-e251cd4d2807',
        'Nhà Riêng',
        'User 84',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 84',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'd3a79874-304b-449b-89f6-12618cc5c269',
        'ACTIVE',
        'thuannguyen85@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen85'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '43c2c1e1-be6d-45b7-80ad-4c9d974ebc26',
        'd3a79874-304b-449b-89f6-12618cc5c269',
        'Nhà Riêng',
        'User 85',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 85',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'b312fac1-8fae-49f9-8915-fd70f50c543f',
        'ACTIVE',
        'thuannguyen86@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen86'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'd72fbfff-fa9e-41b7-8658-147d47ed7609',
        'b312fac1-8fae-49f9-8915-fd70f50c543f',
        'Nhà Riêng',
        'User 86',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 86',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '0d2deffd-9289-4354-8545-68eb19c9857b',
        'ACTIVE',
        'thuannguyen87@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen87'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'b7fb005d-4179-4720-bd60-5157a97bfff8',
        '0d2deffd-9289-4354-8545-68eb19c9857b',
        'Nhà Riêng',
        'User 87',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 87',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '9328be98-aa43-4182-bcc2-3d7b95deef03',
        'ACTIVE',
        'thuannguyen88@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen88'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '52bfea0f-c202-4b22-894a-0f5e170d2b51',
        '9328be98-aa43-4182-bcc2-3d7b95deef03',
        'Nhà Riêng',
        'User 88',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 88',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '6c286346-3121-4f34-a2db-131438010037',
        'ACTIVE',
        'thuannguyen89@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen89'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '7854a879-98e7-478b-96f4-cd9d89537a58',
        '6c286346-3121-4f34-a2db-131438010037',
        'Nhà Riêng',
        'User 89',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 89',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '1411d684-7e0b-4717-8da8-46ca0ff87981',
        'ACTIVE',
        'thuannguyen90@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen90'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '9396749a-013b-44da-a20d-343d30a6e04c',
        '1411d684-7e0b-4717-8da8-46ca0ff87981',
        'Nhà Riêng',
        'User 90',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 90',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '2f735091-2aa2-4956-937b-729458052867',
        'ACTIVE',
        'thuannguyen91@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen91'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '02fd96f4-1dc8-471f-8778-9a1b0175a24b',
        '2f735091-2aa2-4956-937b-729458052867',
        'Nhà Riêng',
        'User 91',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 91',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'fd121439-b5a3-482b-b8ce-a9adcb60c2da',
        'ACTIVE',
        'thuannguyen92@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen92'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '148987f7-fd75-4d2a-8cc0-259c8b40238b',
        'fd121439-b5a3-482b-b8ce-a9adcb60c2da',
        'Nhà Riêng',
        'User 92',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 92',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '03e66e69-a7f3-4b66-8364-bc0a547f5112',
        'ACTIVE',
        'thuannguyen93@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen93'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'e52ec317-4ced-449c-9183-b3df07c65acf',
        '03e66e69-a7f3-4b66-8364-bc0a547f5112',
        'Nhà Riêng',
        'User 93',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 93',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'fcf60a23-c595-40c9-b41d-25a9a3ce687c',
        'ACTIVE',
        'thuannguyen94@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen94'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '0058019d-33f1-48f4-8b99-cc4d701ba1ad',
        'fcf60a23-c595-40c9-b41d-25a9a3ce687c',
        'Nhà Riêng',
        'User 94',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 94',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '9e66d071-ccf8-46ba-94db-d69df2167d13',
        'ACTIVE',
        'thuannguyen95@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen95'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '8c12d956-016b-474a-b4dc-6eff2fe894d2',
        '9e66d071-ccf8-46ba-94db-d69df2167d13',
        'Nhà Riêng',
        'User 95',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 95',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        'ba6c7829-d6c0-4956-8b4e-5a4440f6de04',
        'ACTIVE',
        'thuannguyen96@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen96'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'd3cb84ad-760b-4b40-b90b-454e2efea44b',
        'ba6c7829-d6c0-4956-8b4e-5a4440f6de04',
        'Nhà Riêng',
        'User 96',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 96',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '5f9b8098-9856-49a5-ae0a-052d12f2bcf0',
        'ACTIVE',
        'thuannguyen97@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen97'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '7ed8d006-9283-4f3e-a5c8-082687e00227',
        '5f9b8098-9856-49a5-ae0a-052d12f2bcf0',
        'Nhà Riêng',
        'User 97',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 97',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '06503e8c-292f-47b2-bf93-c6d0906a42e8',
        'ACTIVE',
        'thuannguyen98@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen98'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'f216a8c9-4435-4baf-a8d1-d523d7acaf5c',
        '06503e8c-292f-47b2-bf93-c6d0906a42e8',
        'Nhà Riêng',
        'User 98',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 98',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '3a8168ab-7207-4de4-8149-e570392a42de',
        'ACTIVE',
        'thuannguyen99@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen99'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        '243de94b-6d6f-43d4-b7b4-8df38dbf6883',
        '3a8168ab-7207-4de4-8149-e570392a42de',
        'Nhà Riêng',
        'User 99',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 99',
        0
    );

INSERT INTO
    users (
        id,
        active,
        email,
        password,
        primary_role,
        username
    )
VALUES (
        '02beefa6-14ab-4140-af15-230f85935f7d',
        'ACTIVE',
        'thuannguyen100@gmail.com',
        '$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq',
        'USER',
        'thuannguyen100'
    );

INSERT INTO
    addresses (
        id,
        user_id,
        address_name,
        recipient_name,
        recipient_phone,
        province_id,
        province_name,
        district_id,
        district_name,
        ward_code,
        ward_name,
        street_address,
        is_default
    )
VALUES (
        'e5db22f2-23e5-4aca-a571-357d9df57098',
        '02beefa6-14ab-4140-af15-230f85935f7d',
        'Nhà Riêng',
        'User 100',
        '0388509046',
        202,
        'Hồ Chí Minh',
        1533,
        'Huyện Bình Chánh',
        '22011',
        'Xã Quy Đức',
        '123 Street 100',
        0
    );