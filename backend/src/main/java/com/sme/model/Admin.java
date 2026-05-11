package com.sme.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidade Admin — herda de Usuario (JOINED).
 * Representa o administrador do sistema.
 */
@Entity
@Table(name = "admin")
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@NoArgsConstructor
public class Admin extends Usuario {
}
