package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Place;
import project.kimjinbo.RMS.model.entity.Team;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.PlaceApiRequest;
import project.kimjinbo.RMS.model.network.request.TeamApiRequest;
import project.kimjinbo.RMS.model.network.response.PlaceApiResponse;
import project.kimjinbo.RMS.model.network.response.TeamApiResponse;
import project.kimjinbo.RMS.repository.PlaceRepository;
import project.kimjinbo.RMS.repository.TeamRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeamApiLogicService implements CrudInterface<TeamApiRequest, TeamApiResponse> {

    @Autowired
    private TeamRepository teamRepository;

    @Override
    public Header<TeamApiResponse> create( Header<TeamApiRequest> request ) {
        LocalDate date = LocalDate.now();

        // 1. request data
        TeamApiRequest teamApiRequest = request.getData();

        // 2. team 생성
        Team team = Team.builder()
                .id( teamApiRequest.getId() )
                .registerDate( date )
                .updateDate( date )
                .registerUser( teamApiRequest.getRegisterUser() )
                .updateUser( teamApiRequest.getRegisterUser() )
                .name( teamApiRequest.getName() )
                .phone( teamApiRequest.getPhone() )
                .fax( teamApiRequest.getFax()  )
                .head( teamApiRequest.getHead() )
                .depId( teamApiRequest.getDepId() )
                .placeId( teamApiRequest.getPlaceId() )
                .build();

        Team newTeam = teamRepository.save(team);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newTeam) );

    }

    @Override
    public Header<TeamApiResponse> read(Long id) {
        return null;
    }

    @Override
    public Header<TeamApiResponse> update(Header<TeamApiRequest> request) {
        LocalDate date = LocalDate.now();

        TeamApiRequest teamApiRequest = request.getData();

        // 2. id -> team 데이터 를 찾고
        Optional<Team> optional = teamRepository.findById( teamApiRequest.getId() );

        // 3. data -> update  id
        return optional.map( item -> {
            item
            .setUpdateDate( date )
            .setUpdateUser( teamApiRequest.getUpdateUser() )
            .setId( teamApiRequest.getId() )
            .setName( teamApiRequest.getName() )
            .setPlaceId( teamApiRequest.getPlaceId() )
            .setPhone( teamApiRequest.getPhone() )
            .setFax( teamApiRequest.getFax() );



            return item;
        })
        .map(item -> teamRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) {
        Optional<Team> optional = teamRepository.findById(  Math.toIntExact(id) );

        return optional.map( item ->{
            teamRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header<List<TeamApiResponse>> search(Pageable pageable, TeamApiRequest request) {

        Page<Team> teams = teamRepository.findAll( pageable );

        List<TeamApiResponse> teamApiResponseList = teams.stream()
                .map(item -> response(item))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(teams.getTotalPages())
                .totalElements(teams.getTotalElements())
                .currentPage(teams.getNumber())
                .currentElements(teams.getNumberOfElements())
                .build();

        return Header.OK( teamApiResponseList, pagination );
    }

    public TeamApiResponse response(Team team){

        return TeamApiResponse.builder()
                .id( team.getId() )
                .headDate( (team.getHeadDate()==null) ? null : team.getHeadDate().toString() )
                .updateDate( team.getUpdateDate().toString() )
                .name( team.getName() )
                .phone( team.getPhone() )
                .fax( team.getFax() )
                .head( ( team.getHeadPserson() == null )? null:team.getHeadPserson().getName() )
                .address( ( team.getPlace() == null )? null:team.getPlace().getAddress() )
                .build();
    }
}