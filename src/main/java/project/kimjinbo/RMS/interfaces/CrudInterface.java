package project.kimjinbo.RMS.interfaces;

import java.util.List;

import project.kimjinbo.RMS.model.network.Header;

public interface CrudInterface<Req,Res> {

    Header<Res> create( Header<Req> request );

    Header<Res> read(Long id);

    Header<Res> update(Header<Req> request);

    Header delete(Long id);

}
