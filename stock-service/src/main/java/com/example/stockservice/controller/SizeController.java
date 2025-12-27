package com.example.stockservice.controller;

import com.example.stockservice.dto.SizeDto;
import com.example.stockservice.model.Size;
import com.example.stockservice.repository.SizeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/stock/size")
@RequiredArgsConstructor
public class SizeController {
    private final SizeRepository sizeRepository;
    private final ModelMapper modelMapper;

    @GetMapping("/getSizeById/{sizeId}")
    ResponseEntity<SizeDto> getSizeById(@PathVariable String sizeId) {
        return sizeRepository.findById(sizeId)
                .map(size -> ResponseEntity.ok(modelMapper.map(size, SizeDto.class)))
                .orElse(ResponseEntity.notFound().build());
    }
}

