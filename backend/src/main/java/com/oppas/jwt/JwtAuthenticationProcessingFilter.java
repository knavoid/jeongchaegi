package com.oppas.jwt;

import com.oppas.config.auth.PrincipalDetails;
import com.oppas.entity.member.Member;
import com.oppas.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

/**
 * Jwt 인증 필터
 * "/login" 이외의 URI 요청이 왔을 때 처리하는 필터
 * <p>
 * 기본적으로 사용자는 요청 헤더에 AccessToken만 담아서 요청
 * AccessToken 만료 시에만 RefreshToken을 요청 헤더에 AccessToken과 함께 요청
 * <p>
 * 1. RefreshToken이 없고, AccessToken이 유효한 경우 -> 인증 성공 처리, RefreshToken을 재발급하지는 않는다.
 * 2. RefreshToken이 없고, AccessToken이 없거나 유효하지 않은 경우 -> 인증 실패 처리, 403 ERROR
 * 3. RefreshToken이 있는 경우 -> DB의 RefreshToken과 비교하여 일치하면 AccessToken 재발급, RefreshToken 재발급(RTR 방식)
 * 인증 성공 처리는 하지 않고 실패 처리
 */
@Slf4j
public class JwtAuthenticationProcessingFilter extends BasicAuthenticationFilter {

    private static final String NO_CHECK_URL = "api/member/logout";
    private final JwtService jwtService;
    private final MemberRepository memberRepository;
    static boolean flag;
    public JwtAuthenticationProcessingFilter(AuthenticationManager authenticationManager, JwtService jwtService, MemberRepository memberRepository) {
        super(authenticationManager);
        this.memberRepository = memberRepository;
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (request.getRequestURI().equals(NO_CHECK_URL)) {

            jwtService.extractRefreshToken(request)
                    .ifPresent(refreshtoken -> memberRepository.findByRefreshToken(refreshtoken)
                            .ifPresent(user -> {
                                user.updateRefreshToken("");
                                memberRepository.save(user);
                                saveAuthentication(user);
                                flag = true;
                            })
                    );
            if(flag){
                filterChain.doFilter(request, response);
            }else{
                response.sendError(400);
            }
            return;
        }

        String refreshToken = jwtService.extractRefreshToken(request)
                .filter(jwtService::isTokenValid)
                .orElse(null);

        log.info("리프레쉬 토큰 {}", refreshToken);

        if (refreshToken != null) {
            log.info("리프레쉬토큰 들어갔다.");
            filterChain.doFilter(request,response);
            return;
        }

        if (refreshToken == null) {
            checkAccessTokenAndAuthentication(request, response, filterChain);
        }
    }

    /**
     * [리프레시 토큰으로 유저 정보 찾기 & 액세스 토큰/리프레시 토큰 재발급 메소드]
     * 파라미터로 들어온 헤더에서 추출한 리프레시 토큰으로 DB에서 유저를 찾고, 해당 유저가 있다면
     * JwtService.createAccessToken()으로 AccessToken 생성,
     * reIssueRefreshToken()로 리프레시 토큰 재발급 & DB에 리프레시 토큰 업데이트 메소드 호출
     * 그 후 JwtService.sendAccessTokenAndRefreshToken()으로 응답 헤더에 보내기
     */
    public void checkRefreshTokenAndReIssueAccessToken(HttpServletResponse response, String refreshToken) {
        memberRepository.findByRefreshToken(refreshToken)
                .ifPresent(user -> {
                    String reIssuedRefreshToken = reIssueRefreshToken(user);
                    jwtService.sendAccessAndRefreshToken(response, jwtService.createAccessToken(user.getEmail()),
                            reIssuedRefreshToken, true); // 응답헤더 저장
                });
    }

    /**
     * [리프레시 토큰 재발급 & DB에 리프레시 토큰 업데이트 메소드]
     * jwtService.createRefreshToken()으로 리프레시 토큰 재발급 후
     * DB에 재발급한 리프레시 토큰 업데이트 후 Flush
     */
    private String reIssueRefreshToken(Member user) {

        String reIssuedRefreshToken = jwtService.createRefreshToken();
        user.updateRefreshToken(reIssuedRefreshToken);
        memberRepository.saveAndFlush(user);
        return reIssuedRefreshToken;
    }

    /**
     * [액세스 토큰 체크 & 인증 처리 메소드]
     * request에서 extractAccessToken()으로 액세스 토큰 추출 후, isTokenValid()로 유효한 토큰인지 검증
     * 유효한 토큰이면, 액세스 토큰에서 extractName로 Name을 추출한 후 findByName()로 해당 이름을 사용하는 유저 객체 반환
     * 그 유저 객체를 saveAuthentication()으로 인증 처리하여
     * 인증 허가 처리된 객체를 SecurityContextHolder에 담기
     * 그 후 다음 인증 필터로 진행
     */
    public void checkAccessTokenAndAuthentication(HttpServletRequest request, HttpServletResponse response,
                                                  FilterChain filterChain) throws ServletException, IOException {
        Optional<String> token = jwtService.extractAccessToken(request);

        if (!token.isEmpty()) {
            Optional<String> valid = token.filter(jwtService::isTokenValid);
            if (!valid.isEmpty()) {
                // 에세스 토큰이 유효하면 인증에 넣어주기
                valid.ifPresent(accessToken -> jwtService.extractName(accessToken)
                        .ifPresent(name -> memberRepository.findByName(name)
                                .ifPresent(this::saveAuthentication))); // 엑세스 토큰확인
            } else {
                log.info("유효하지 않은 토큰이다 리프레쉬 주세요");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
                return ;
            }
        }
        filterChain.doFilter(request, response);
    }

    /**
     * [인증 허가 메소드]
     * 파라미터의 유저 : 우리가 만든 회원 객체 / 빌더의 유저 : UserDetails의 User 객체
     * <p>
     * new UsernamePasswordAuthenticationToken()로 인증 객체인 Authentication 객체 생성
     * UsernamePasswordAuthenticationToken의 파라미터
     * 1. 위에서 만든 UserDetailsUser 객체 (유저 정보)
     * 2. credential(보통 비밀번호로, 인증 시에는 보통 null로 제거)
     * 3. Collection < ? extends GrantedAuthority>로,
     * UserDetails의 User 객체 안에 Set<GrantedAuthority> authorities이 있어서 getter로 호출한 후에,
     * new NullAuthoritiesMapper()로 GrantedAuthoritiesMapper 객체를 생성하고 mapAuthorities()에 담기
     * <p>
     * SecurityContextHolder.getContext()로 SecurityContext를 꺼낸 후,
     * setAuthentication()을 이용하여 위에서 만든 Authentication 객체에 대한 인증 허가 처리
     */
    public void saveAuthentication(Member myUser) {
        PrincipalDetails userDetailsUser = new PrincipalDetails(myUser);

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(userDetailsUser, null,
                        userDetailsUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}