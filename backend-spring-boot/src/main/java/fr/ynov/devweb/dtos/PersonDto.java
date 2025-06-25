package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

import io.micrometer.common.lang.NonNull;
import jakarta.annotation.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDto {
    @NonNull()
    private String id;
    @Nullable()
    private String name;
    @Nullable()
    private LocalDate birth;
    @Nullable()
    private String address;
    @NonNull()
    private String email;
    @Nullable()
    private String phone;
}
