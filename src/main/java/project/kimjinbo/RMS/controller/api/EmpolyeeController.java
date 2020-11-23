package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.request.EmployeeApiRequest;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.DepartmentListApiResponse;
import project.kimjinbo.RMS.model.network.response.EmployeeApiResponse;
import project.kimjinbo.RMS.service.DepartmentApiLogicService;
import project.kimjinbo.RMS.service.EmployeeApiLogicService;

import java.util.List;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class EmpolyeeController implements CrudInterface<EmployeeApiRequest, EmployeeApiResponse> {

    @Autowired
    EmployeeApiLogicService employeeApiLogicService;

    @GetMapping("/employees")
    @ResponseBody
    public Header<List<EmployeeApiResponse>> readEmployee(@PageableDefault(sort = { "name" }, direction = Sort.Direction.ASC) Pageable pageable, EmployeeApiRequest request) {
        return employeeApiLogicService.search( pageable, request );
    }

    @Override
    @PostMapping("/employee")
    public Header<EmployeeApiResponse> create(@RequestBody Header<EmployeeApiRequest> request) {
        return employeeApiLogicService.create( request );
    }

    @Override
    @PutMapping("/employee")
    public Header<EmployeeApiResponse> update(@RequestBody Header<EmployeeApiRequest> request) {
        return employeeApiLogicService.update( request );
    }

    @DeleteMapping("/employee/{id}")
    public Header delete(@PathVariable(name = "id")Long id) {
        return employeeApiLogicService.delete( id );
    }

    @Override
    public Header<EmployeeApiResponse> read(Long id) {
        return null;
    }
}

