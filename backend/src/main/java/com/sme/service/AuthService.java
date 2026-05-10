package com.sme.service;

import com.sme.config.JwtUtil;
import com.sme.dto.LoginRequestDTO;
import com.sme.dto.LoginResponseDTO;
import com.sme.model.EmpresaParceira;
import com.sme.model.Usuario;
import com.sme.repository.EmpresaParceiraRepository;
import com.sme.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository,
                       EmpresaParceiraRepository empresaRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        // Tentar encontrar em Usuario (Aluno ou Professor)
        var usuarioOpt = usuarioRepository.findByEmail(request.email());
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (passwordEncoder.matches(request.senha(), usuario.getSenha())) {
                String role = usuario.getRole().name();
                String token = jwtUtil.generateToken(usuario.getEmail(), role, usuario.getId(), usuario.getNome());
                return new LoginResponseDTO(token, role, usuario.getId(), usuario.getNome(), usuario.getEmail());
            }
        }

        // Tentar encontrar em EmpresaParceira
        var empresaOpt = empresaRepository.findByEmail(request.email());
        if (empresaOpt.isPresent()) {
            EmpresaParceira empresa = empresaOpt.get();
            if (passwordEncoder.matches(request.senha(), empresa.getSenha())) {
                String token = jwtUtil.generateToken(empresa.getEmail(), "EMPRESA", empresa.getId(), empresa.getNome());
                return new LoginResponseDTO(token, "EMPRESA", empresa.getId(), empresa.getNome(), empresa.getEmail());
            }
        }

        throw new IllegalArgumentException("Credenciais inválidas");
    }
}
