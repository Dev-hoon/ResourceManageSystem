package project.kimjinbo.RMS.sampleData;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.repository.CategoryRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public class CategorySample extends RMSApplicationTests {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    public void createSample(){
        LocalDate date = LocalDate.now();
        List<String> category01 = Arrays.asList("HW","HW","HW","HW","HW","HW","SW","SW","SW","SW","SW","SW","SW","SW" );
        List<String> category02 = Arrays.asList("컴퓨터","노트북","케이블","케이블","가구","가구","OS","OS","OS","디자인","디자인","MS","MS","MS");
        List<String> category03 = Arrays.asList("데스크탑","노트북","C타입","HDMI","책상","의자","linux","mac","windows","포토샵","일러스트","워드","엑셀","파워포인트");

        for(int i = 0; i < category01.size(); i++){
            Category create = Category.builder().superCate(category01.get(i)).subCateFirst(category02.get(i)).subCateSecond(category03.get(i))
                    .registerDate( date ).registerUser( 0L ).updateDate( date ).updateUser( 0L ).build();
            categoryRepository.save(create);
        }


    }
}