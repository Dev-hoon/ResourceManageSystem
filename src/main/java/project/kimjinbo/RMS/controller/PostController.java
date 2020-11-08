package project.kimjinbo.RMS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.kimjinbo.RMS.repository.CategoryRepository;


@RestController
@RequestMapping("/api")
public class PostController {
    //@PostMapping(value = "/postMethod", produces = {"application-json"})
    @Autowired
    CategoryRepository cateRepo;

}