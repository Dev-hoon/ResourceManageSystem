package project.kimjinbo.RMS.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.kimjinbo.RMS.model.entity.Team;


@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {

}
