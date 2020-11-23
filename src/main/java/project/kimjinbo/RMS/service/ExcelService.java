package project.kimjinbo.RMS.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.controller.api.ExcelController;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.entity.ItemTemp;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemTempApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.model.network.response.ItemTempApiResponse;
import project.kimjinbo.RMS.repository.ItemTempRepository;
import sun.rmi.runtime.Log;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ExcelService implements CrudInterface<ItemTempApiRequest,ItemTempApiResponse> {
    @Autowired
    ItemApiLogicService itemApiLogicService;
    @Autowired
    ItemTempRepository itemTempRepository;

    //public Header<ItemTempApiResponse> create(ItemTempApiRequest request) {
    public void create(ItemTempApiRequest request) {
        LocalDate date = LocalDate.now();

        log.info("create check "+ request.getId());
        System.out.println("controller request : "+ request.getId());
        // 1. request data
        //ItemTempApiRequest ItemTempApiRequest = request.getData();

        // 2. Item 생성
        ItemTemp item = ItemTemp.builder()
                .id( request.getId() )
                .superCate( request.getSuperCate() )
                .subCateFirst( request.getSubCateFirst() )
                .subCateSecond(request.getSubCateSecond() )
                .registerDate( date )
                .registerUser( request.getRegisterUser() )
                .registerUser( 1L )
                //.expireDate( LocalDate.parse(request.getExpireDate(), DateTimeFormatter.ISO_DATE) )
                .updateDate(date)
                .updateUser(1L)
                .expireDate( (request.getExpireDate()==null)? null : LocalDate.parse(request.getExpireDate(), DateTimeFormatter.ISO_DATE) )
                .name( request.getName() )
                .cost( request.getCost() )
                .purchaseCost( request.getPurchaseCost() )
                .memo( request.getMemo() )
                .itemState( request.getItemState() )
                .rentalState( request.getRentalState()  )
                .placeState( request.getPlaceState() )
                .cdKey(request.getCdKey())
                .licence(request.getLicence())
                .detail(request.getDetail())
                .build();

        ItemTemp newItem = itemTempRepository.save(item);

        // 3. 생성된 데이터 -> userApiResponse return
        //return Header.OK( response(newItem) );
        return;
    }

    public ItemTempApiResponse response(ItemTemp item){

        ItemTempApiResponse itemApiResponse = ItemTempApiResponse.builder()
                .id(item.getId())
                .superCate( item.getSuperCate() )
                .subCateFirst( item.getSubCateFirst() )
                .subCateSecond(item.getSubCateSecond() )
                .registerDate(item.getRegisterDate() )
                .expireDate(item.getExpireDate() )
                .name( item.getName() )
                .cost( item.getCost() )
                .purchaseCost( item.getPurchaseCost() )
                .memo( item.getMemo() )
                .placeState( item.getPlaceState() )
                .itemState( (item.getItemState()==null)? null : ItemState.titleOf( item.getItemState()) )
                .rentalState( (item.getRentalState()==null)? null : RentalState.titleOf(item.getRentalState()) )
                .build();

        return itemApiResponse;
    }

    @Override
    public Header<ItemTempApiResponse> create(Header<ItemTempApiRequest> request) {
        return null;
    }

    @Override
    public Header<ItemTempApiResponse> read(Long id) {
        return null;
    }

    @Override
    public Header<ItemTempApiResponse> update(Header<ItemTempApiRequest> request) {
        return null;
    }

    @Override
    public Header delete(Long id) {
        return null;
    }

    /*public  Header<List<ItemApiResponse>> readExcel(MultipartFile file, Model model, Workbook workbook)
            throws IOException { // 2
        ExcelTempRepository excelTempRepository;
        List<ItemApiRequest> dataList;


        dataList = new ArrayList<>();



        Sheet worksheet = workbook.getSheetAt(0);

        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            ItemApiRequest data = new ItemApiRequest();

            data.setName(row.getCell(0).getStringCellValue());
            data.setSuperCate(row.getCell(1).getStringCellValue());
            data.setSubCateFirst(row.getCell(2).getStringCellValue());
            data.setSubCateSecond(row.getCell(3).getStringCellValue());
            data.setExpireDate(row.getCell(4).getStringCellValue());
            data.setItemState(row.getCell(5).getStringCellValue());
            data.setRentalState(row.getCell(6).getStringCellValue());
            data.setPlaceState((int)row.getCell(7).getNumericCellValue());


            dataList.add(data);
        }

        List<ItemApiResponse> dataApiResponseList = dataList.stream()
                .map(item -> response(item))
                .collect(Collectors.toList());
        //itemApiLogicService.create(dataList);
        model.addAttribute("datas", dataList); // 5

        return Header.OK(dataApiResponseList);

    }

    public ItemApiResponse response(ItemApiRequest item){

        ItemApiResponse itemApiResponse = ItemApiResponse.builder()
                .id(item.getId())
                .superCate( item.getSuperCate() )
                .subCateFirst( item.getSubCateFirst() )
                .subCateSecond(item.getSubCateSecond() )
                .name( item.getName() )
                .cost( item.getCost() )
                .purchaseCost( item.getPurchaseCost() )
                .memo( item.getMemo() )
                .placeState( item.getPlaceState() )
                .build();

        return itemApiResponse;
    }*/
}
