package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.TeamApiRequest;
import project.kimjinbo.RMS.model.network.response.TeamApiResponse;
import project.kimjinbo.RMS.service.TeamApiLogicService;

import java.util.List;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class TeamController implements CrudInterface<TeamApiRequest, TeamApiResponse> {

    @Autowired
    private TeamApiLogicService teamApiLogicService;

    // 조건 사용 가능  localhost:8080/api/items
    @GetMapping("/teams")
    @ResponseBody
    public Header<List<TeamApiResponse>> readTeams(@PageableDefault(sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable, TeamApiRequest teamApiRequest) {
        System.out.println("request : "+teamApiRequest);
        return teamApiLogicService.search( pageable, teamApiRequest );
    }


    @Override
    @PostMapping("/team")
    public Header<TeamApiResponse> create(@RequestBody Header<TeamApiRequest> request) {
        System.out.println("controller request : "+request);
        return teamApiLogicService.create( request );
    }

    // /api/item?id={id}
    @Override
    @GetMapping("/team")
    public Header<TeamApiResponse> read(@RequestParam(name = "id") Long id) {
        return null;
    }

    @Override
    @PutMapping("/team")
    public Header<TeamApiResponse> update(@RequestBody Header<TeamApiRequest> request) {
        return teamApiLogicService.update( request );
    }

    @Override
    @DeleteMapping("/team/{id}")
    public Header delete(@PathVariable(name = "id") Long id) {
        System.out.println("id : "+id);
        return teamApiLogicService.delete( id );
    }

     /*
    @GetMapping("/item/setting")
    public Header setting( ) {
        return itemApiLogicService.setting();
    }
*/
}

