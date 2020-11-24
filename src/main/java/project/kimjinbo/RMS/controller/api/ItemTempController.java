package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.ItemTemp;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemTempApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemTempRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.model.network.response.ItemTempApiResponse;
import project.kimjinbo.RMS.repository.ItemTempRepository;
import project.kimjinbo.RMS.service.ItemTempApiLogicService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class ItemTempController implements CrudInterface<ItemTempApiRequest, ItemTempApiRequest > {

    @Autowired
    private ItemTempRepository itemTempRepository;

    @Autowired
    private ItemTempApiLogicService itemTempApiLogicService;

    @GetMapping("/temps")
    @ResponseBody
    public Header<List<ItemTempApiResponse>> readItems(@PageableDefault(sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable, ItemTempApiRequest ItemTempApiRequest) {
        System.out.println("request : "+ItemTempApiRequest);
        return itemTempApiLogicService.search( pageable, ItemTempApiRequest );
    }

    @PostMapping("/temps")
    public Header createItems(@RequestBody Header<ItemTempRequest> request) {
        return itemTempApiLogicService.deleteItems( request );
    }

    @PostMapping("/temps/delete")
    public Header deleteItems(@RequestBody Header<ItemTempRequest> request) {
        return itemTempApiLogicService.deleteItems( request );
    }


    @Override
    @GetMapping("/temp")
    public Header read(@RequestParam(name = "id") Long id) { return itemTempApiLogicService.read(id); }

    @Override
    @PostMapping("/temp")
    public Header create(@RequestBody Header<ItemTempApiRequest> request) {
        return itemTempApiLogicService.create( request );
    }

    @Override
    @PutMapping("/temp")
    public Header update(@RequestBody Header<ItemTempApiRequest> request) {
        return itemTempApiLogicService.update( request );
    }

    @Override
    @DeleteMapping("/temp/{id}")
    public Header delete(@PathVariable(name = "id") Long id) {
        return itemTempApiLogicService.delete(id);
    }
}
