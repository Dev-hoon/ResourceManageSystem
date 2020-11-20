package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Department;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.DepartmentListApiResponse;
import project.kimjinbo.RMS.repository.DepartmentRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepartmentApiLogicService implements CrudInterface<DepartmentApiRequest, DepartmentApiResponse> {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Header<DepartmentApiResponse> create( Header<DepartmentApiRequest> request ) {
        LocalDate date = LocalDate.now();

        // 1. request data
        DepartmentApiRequest departmentApiRequest = request.getData();

        // 2. department 생성
        Department department = Department.builder()
                .id( departmentApiRequest.getId() )
                .registerDate( date )
                .updateDate( date )
                .registerUser( departmentApiRequest.getRegisterUser() )
                .updateUser( departmentApiRequest.getRegisterUser() )
                .name( departmentApiRequest.getName() )
                .phone( departmentApiRequest.getPhone() )
                .fax( departmentApiRequest.getFax()  )
                .head( departmentApiRequest.getHead() )
                .placeId( departmentApiRequest.getPlaceId() )
                .build();

        System.out.println("department : "+department);

        Department newDepartment = departmentRepository.save(department);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newDepartment) );

    }

    @Override
    public Header<DepartmentApiResponse> read(Long id) {
        return null;
    }

    @Override
    public Header<DepartmentApiResponse> update(Header<DepartmentApiRequest> request) {
        LocalDate date = LocalDate.now();

        DepartmentApiRequest departmentApiRequest = request.getData();

        // 2. id -> department 데이터 를 찾고
        Optional<Department> optional = departmentRepository.findById( departmentApiRequest.getId() );

        // 3. data -> update  id
        return optional.map( item -> {
            item
            .setUpdateDate( date )
            .setUpdateUser( departmentApiRequest.getUpdateUser() )
            .setId( departmentApiRequest.getId() )
            .setName( departmentApiRequest.getName() )
            .setPlaceId( departmentApiRequest.getPlaceId() )
            .setPhone( departmentApiRequest.getPhone() )
            .setFax( departmentApiRequest.getFax() );

            return item;
        })
        .map(item -> departmentRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) {
        Optional<Department> optional = departmentRepository.findById(  Math.toIntExact(id) );

        return optional.map( item ->{
            departmentRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header<List<DepartmentApiResponse>> search(Pageable pageable, DepartmentApiRequest request) {

        Page<Department> departments = departmentRepository.findAll( pageable );

        List<DepartmentApiResponse> departmentApiResponseList = departments.stream()
                .map(item -> response(item))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(departments.getTotalPages())
                .totalElements(departments.getTotalElements())
                .currentPage(departments.getNumber())
                .currentElements(departments.getNumberOfElements())
                .build();

        return Header.OK( departmentApiResponseList, pagination );
    }

    public Header<List<DepartmentListApiResponse>> searchList( ) {

        List<Department> departments = departmentRepository.findAll( );

        List<DepartmentListApiResponse> departmentListApiResponseList = departments.stream()
                .map(item -> DepartmentListApiResponse.builder().id( item.getId() ).name( item.getName() ).build() )
                .collect(Collectors.toList());

        return Header.OK( departmentListApiResponseList );
    }

    public DepartmentApiResponse response(Department department){

        return DepartmentApiResponse.builder()
                .id( department.getId() )
                .headDate( (department.getHeadDate()==null) ? null : department.getHeadDate().format( DateTimeFormatter.ISO_DATE) )
                .updateDate( department.getUpdateDate().format(DateTimeFormatter.ISO_DATE) )
                .name( department.getName() )
                .phone( department.getPhone() )
                .fax( department.getFax() )
                .head( (department.getHeadPserson()==null) ? null :department.getHeadPserson().getName() )
                .placeId( (department.getPlace()==null) ? null :department.getPlace().getId() )
                .address( (department.getPlace()==null) ? null :department.getPlace().getAddress() )
                .addressName( (department.getPlace()==null) ? null :department.getPlace().getName() )
                .addressDetail( (department.getPlace()==null) ? null :department.getPlace().getAddressDetail() )
                .build();
    }

}