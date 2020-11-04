package project.kimjinbo.RMS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.repository.CategoryRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.*;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class GetController {

    @GetMapping("/getParameter") //localhost:8080/api/getParameter?id=0000&password=1234
    public String getParameter(@RequestParam String id, @RequestParam String password){
        System.out.println("id :" + id);
        System.out.println("password :" + password);
        return "OK";
    }

/*
    @GetMapping("/Categories") // localhost:8080/api/getCate?id=0000&password=1234
    public String  getMultiParameter(@RequestParam String id, @RequestParam String password){
        System.out.println("id : "+id);
        System.out.println("passwor : "+password);
        return id+password;
    }
*/
    // @Autowired

}
