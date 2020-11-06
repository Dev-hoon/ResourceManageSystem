package project.kimjinbo.RMS.repository;

import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Item;

import java.util.Optional;


public class ItemRepositoryTest extends RMSApplicationTests {
    @Autowired
    private ItemRepository itemRepository;

    @Test
    public void create(){
        /*
        CategoryId cateId = new CategoryId("HW","컴퓨터","노트북");
        Category category = new Category();
        category.setSuperCate( cateId.getSuperCate() );
        category.setSubCateFirst( cateId.getSubCateFirst() );
        category.setSubCateSecond( cateId.getSubCateSecond() );
        category.setRegisteDate( LocalDate.now() );
        category.setRegisterUser( 0L );
        category.setUpdateDate( LocalDate.now() );

        Category newCate = itemRepo.save( category );*/
        //System.out.println("newCate   : "+newCate);

        System.out.println("test done!");

    }

    @Test
    public void read(){
        Long id = 0L;

        Optional<Item> item = itemRepository.findById( id );
        //Assert.assertTrue( item.isPresent() );

        System.out.println("item : "+item.get());
    }

}