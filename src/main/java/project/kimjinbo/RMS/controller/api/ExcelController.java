package project.kimjinbo.RMS.controller.api;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.NumberToTextConverter;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.ItemTemp;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemTempApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.model.network.response.ItemTempApiResponse;
import project.kimjinbo.RMS.service.ExcelService;
import project.kimjinbo.RMS.service.ItemApiLogicService;

@Slf4j
@RestController
@RequestMapping("/api") //localhost:8080/api
public class ExcelController implements CrudInterface<ItemTempApiRequest, ItemTempApiResponse> {

    @Autowired
    private ExcelService excelService;
    //https://shinsunyoung.tistory.com/71
/*
    @GetMapping("/excel")
    public String main() { // 1
        return "/pages/item";
    }
    @PostMapping("/excel/read")
    public Header<List<ItemTempApiRequest>> readExcel(@RequestParam("file") MultipartFile file, Model model) throws IOException {

        List<ItemApiRequest> dataList = new ArrayList<>();

        String extension = FilenameUtils.getExtension(file.getOriginalFilename()); // 3

        if (!extension.equals("xlsx") && !extension.equals("xls")) {
            throw new IOException("엑셀파일만 업로드 해주세요.");
        }

        Workbook workbook = null;

        if (extension.equals("xlsx")) {
            workbook = new XSSFWorkbook(file.getInputStream());
        } else if (extension.equals("xls")) {
            workbook = new HSSFWorkbook(file.getInputStream());
        }



        Sheet worksheet = workbook.getSheetAt(0);

        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            ItemApiRequest data = new ItemApiRequest();

            data.setId((long) row.getCell(0).getNumericCellValue());
            data.setName(row.getCell(1).getStringCellValue());
            data.setSuperCate(row.getCell(2).getStringCellValue());
            data.setSubCateFirst(row.getCell(3).getStringCellValue());
            data.setSubCateSecond(row.getCell(4).getStringCellValue());
            data.setExpireDate(row.getCell(5).getStringCellValue());
            data.setItemState(row.getCell(6).getStringCellValue());
            data.setRentalState(row.getCell(7).getStringCellValue());
            data.setPlaceState((int)row.getCell(8).getNumericCellValue());


            dataList.add(data);
        }

        //itemApiLogicService.create(dataList);
        model.addAttribute("datas", dataList); // 5

        return excelService.readExcel(file,model,workbook);
    }*/

    @PostMapping("/excel/save")
    public void save(@RequestParam("file") MultipartFile file, Model model) throws IOException{
        System.out.println("controller request : ");
        log.info("save check ");

        List<ItemTempApiRequest> dataList = new ArrayList<>();

        String extension = FilenameUtils.getExtension(file.getOriginalFilename()); // 3

        if (!extension.equals("xlsx") && !extension.equals("xls")) {
            throw new IOException("엑셀파일만 업로드 해주세요.");
        }

        Workbook workbook = null;

        if (extension.equals("xlsx")) {
            workbook = new XSSFWorkbook(file.getInputStream());
        } else if (extension.equals("xls")) {
            workbook = new HSSFWorkbook(file.getInputStream());
        }



        Sheet worksheet = workbook.getSheetAt(0);

        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            ItemTempApiRequest data = new ItemTempApiRequest();

            data.setId((long)row.getCell(0).getNumericCellValue());
            data.setName(row.getCell(1).getStringCellValue());
            data.setSuperCate(row.getCell(2).getStringCellValue());
            data.setSubCateFirst(row.getCell(3).getStringCellValue());
            data.setSubCateSecond(row.getCell(4).getStringCellValue());
            data.setExpireDate(row.getCell(5).getStringCellValue());
            data.setItemState((int)row.getCell(6).getNumericCellValue());
            data.setRentalState((int)row.getCell(7).getNumericCellValue());
            data.setPlaceState((int)row.getCell(8).getNumericCellValue());
            data.setCdKey(row.getCell(9).getStringCellValue());
            data.setLicence(row.getCell(10).getStringCellValue());
            data.setCost((long)row.getCell(11).getNumericCellValue());
            data.setPurchaseCost((long)row.getCell(12).getNumericCellValue());
            data.setMemo(row.getCell(13).getStringCellValue());


            dataList.add(data);
            excelService.create( data);
        }
        return;
    }
    @Override
    public Header<ItemTempApiResponse> create(Header<ItemTempApiRequest> request) {

        System.out.println("controller request : "+request);
        return excelService.create( request );
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
/*@PostMapping("/excel/read")
public String readExcel(@RequestParam("file") MultipartFile file, Model model)
        throws IOException {

    // Tika tika = new Tika(); // Apache Tika 사용
    //  String detect = tika.detect(file.getBytes()); // Tika를 사용해서 MIME 타입 얻어내기

    List<ExcelApiRequest> dataList = new ArrayList<>();
    String extension = FilenameUtils.getExtension(file.getOriginalFilename());

       *//* if (!isExcel(detect, extension)) {
            throw new IOException("엑셀파일만 업로드 해주세요.");
        }*//*

    Workbook workbook = null;

    if (extension.equals("xlsx")) {
        workbook = new XSSFWorkbook(file.getInputStream());
    } else if (extension.equals("xls")) {
        workbook = new HSSFWorkbook(file.getInputStream());
    }

    assert workbook != null;
    Sheet worksheet = workbook.getSheetAt(0);

    for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) {

        Row row = worksheet.getRow(i);

        ExcelApiRequest data = new ExcelApiRequest();

        data.setName(row.getCell(0).getStringCellValue());
        data.setSuperCate(row.getCell(1).getStringCellValue());
        data.setSubCateFirst(row.getCell(2).getStringCellValue());
        data.setSubCateSecond(row.getCell(3).getStringCellValue());
        data.setExpireDate(row.getCell(4).getStringCellValue());
        data.setItemState(row.getCell(5).getStringCellValue());
        data.setRentalState(row.getCell(6).getStringCellValue());
        data.setPlaceState((int)row.getCell(7).getNumericCellValue());
        data.setCdKey(row.getCell(8).getStringCellValue());
        data.setLicence(row.getCell(9).getStringCellValue());
        data.setCost((long)row.getCell(10).getNumericCellValue());
        data.setPurchaseCost((long)row.getCell(11).getNumericCellValue());
        data.setMemo(row.getCell(12).getStringCellValue());



        dataList.add(data);
    }

    model.addAttribute("datas", dataList);

    return "/fragment/modal/excelModal";
}*/







    /*public Header<ItemApiRequest> excelUpload() throws IOException{
        dataList;
    }*/
}