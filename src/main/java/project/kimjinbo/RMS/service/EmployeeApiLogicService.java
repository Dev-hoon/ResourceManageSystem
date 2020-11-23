package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.configs.EmployeeSpecs;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Department;
import project.kimjinbo.RMS.model.entity.Employee;
import project.kimjinbo.RMS.model.entity.Team;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.request.EmployeeApiRequest;
import project.kimjinbo.RMS.model.network.request.TeamApiRequest;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.EmployeeApiResponse;
import project.kimjinbo.RMS.model.network.response.TeamApiResponse;
import project.kimjinbo.RMS.repository.EmployeeRepository;
import project.kimjinbo.RMS.repository.TeamRepository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeApiLogicService implements CrudInterface<EmployeeApiRequest, EmployeeApiResponse> {

    @Autowired
    EmployeeRepository employeeRepository;

    @Override
    public Header<EmployeeApiResponse> create(Header<EmployeeApiRequest> request) {
        LocalDate date = LocalDate.now();

        // 1. request data
        EmployeeApiRequest employeeApiRequest = request.getData();

        // 2. department 생성
        Employee employee = Employee.builder()
                .id( employeeApiRequest.getId() )
                .registerDate( date )
                .updateDate( date )
                .registerUser( employeeApiRequest.getRegisterUser() )
                .updateUser( employeeApiRequest.getRegisterUser() )
                .enteredDate( employeeApiRequest.getEnteredDate() )
                .name( employeeApiRequest.getName() )
                .email( employeeApiRequest.getEmail() )
                .phone( employeeApiRequest.getPhone() )
                .position( employeeApiRequest.getPosition() )
                .depId( employeeApiRequest.getDepId() )
                .teamId( employeeApiRequest.getTeamId() )
                .memo( employeeApiRequest.getMemo() )
                .empNum( employeeApiRequest.getEmpNum() )
                .build();

        System.out.println("employee : "+employee);

        Employee newEmployee = employeeRepository.save(employee);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newEmployee) );
    }

    @Override
    public Header<EmployeeApiResponse> read(Long id) {
        return null;
    }

    @Override
    public Header<EmployeeApiResponse> update(Header<EmployeeApiRequest> request) {
        LocalDate date = LocalDate.now();

        EmployeeApiRequest employeeApiRequest = request.getData();

        // 2. id -> department 데이터 를 찾고
        Optional<Employee> optional = employeeRepository.findById( employeeApiRequest.getId() );

        // 3. data -> update  id
        return optional.map( item -> {
            item
            .setUpdateDate( date )
            .setUpdateUser( employeeApiRequest.getUpdateUser() )
            .setEnteredDate( employeeApiRequest.getEnteredDate() )
            .setName( employeeApiRequest.getName() )
            .setEmail( employeeApiRequest.getEmail() )
            .setPhone( employeeApiRequest.getPhone() )
            .setPosition( employeeApiRequest.getPosition() )
            .setMemo( employeeApiRequest.getMemo() )
            .setEmpNum( employeeApiRequest.getEmpNum() )
            .setTeamId( employeeApiRequest.getTeamId() )
            .setDepId( employeeApiRequest.getDepId() );

            return item;
        })
        .map(item -> employeeRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) {
        Optional<Employee> optional = employeeRepository.findById( id );

        return optional.map( item ->{
            employeeRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header<List<EmployeeApiResponse>> search(Pageable pageable, EmployeeApiRequest request) {

        Page<Employee> employee = employeeRepository.findAll(
                EmployeeSpecs.name( request.getName() ).and(
                EmployeeSpecs.phone(request.getPhone())).and(
                EmployeeSpecs.email(request.getEmail())).and(
                EmployeeSpecs.depId( request.getDepId())).and(
                EmployeeSpecs.teamId( request.getTeamId() )).and(
                EmployeeSpecs.position( request.getPosition() ))
                ,pageable );

        List<EmployeeApiResponse> departmentApiResponseList = employee.stream()
                .map(item -> response(item))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(employee.getTotalPages())
                .totalElements(employee.getTotalElements())
                .currentPage(employee.getNumber())
                .currentElements(employee.getNumberOfElements())
                .build();

        return Header.OK( departmentApiResponseList, pagination );
    }

    public EmployeeApiResponse response(Employee employee){

        return EmployeeApiResponse.builder()
                .id( employee.getId() )
                .depId( employee.getDepId() )
                .teamId( employee.getTeamId() )
                .enteredDate( employee.getEnteredDate() )
                .name( employee.getName() )
                .email( employee.getEmail() )
                .phone( employee.getPhone() )
                .position( employee.getPosition() )
                .memo( employee.getMemo() )
                .teamName( (employee.getTeam()==null)?null:employee.getTeam().getName() )
                .departmentName( (employee.getDepartment()==null)?null:employee.getDepartment().getName() )
                .build();
    }
}