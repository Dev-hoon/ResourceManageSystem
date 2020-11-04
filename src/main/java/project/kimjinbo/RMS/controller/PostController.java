package project.kimjinbo.RMS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.CategoryId;
import project.kimjinbo.RMS.repository.CategoryRepository;

import java.time.LocalDate;
import java.util.Optional;


@RestController
@RequestMapping("/api")
public class PostController {
    //@PostMapping(value = "/postMethod", produces = {"application-json"})
    @Autowired
    CategoryRepository cateRepo;

}